/** biome-ignore-all lint/suspicious/noConsole: this is a script */
/** biome-ignore-all lint/nursery/noAwaitInLoop: this is a script */

import { openai } from '@ai-sdk/openai';
import { embedMany, generateObject } from 'ai';
import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
// Configuração do cliente S3
import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { drizzle } from 'drizzle-orm/postgres-js';
import pdf from 'pdf-parse';
import postgres from 'postgres';
import { z } from 'zod';
import { file, fileChunk } from '@/lib/db/schema';

interface S3Config {
  endpoint: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  forcePathStyle?: boolean;
}

// Função para criar cliente S3 compatível com diferentes providers
function createS3Client(config: S3Config): S3Client {
  return new S3Client({
    endpoint: config.endpoint,
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    forcePathStyle: config.forcePathStyle ?? true, // Necessário para MinIO e outros providers
  });
}

// Função para fazer upload do arquivo para S3
async function uploadFileToS3(
  s3Client: S3Client,
  bucketName: string,
  key: string,
  fileBody: Buffer,
  contentType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileBody,
    ContentType: contentType,
  });

  await s3Client.send(command);

  // Retorna a URL do arquivo (pode variar dependendo do provider)
  return `${key}`;
}

// Função para verificar se o arquivo já existe
async function checkFileExists(
  s3Client: S3Client,
  bucketName: string,
  key: string
): Promise<boolean> {
  try {
    const command = new HeadObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    await s3Client.send(command);
    return true;
  } catch (_) {
    return false;
  }
}

(async () => {
  try {
    console.log('🚀 Iniciando o script...');

    const s3Config: S3Config = {
      endpoint: process.env.S3_ENDPOINT as string,
      region: process.env.S3_REGION as string,
      accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
      bucketName: process.env.S3_BUCKET as string,
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== 'false',
    };

    if (!s3Config.accessKeyId) {
      throw new Error('Variável de ambiente S3_ACCESS_KEY_ID não definida.');
    }

    if (!s3Config.secretAccessKey) {
      throw new Error(
        'Variável de ambiente S3_SECRET_ACCESS_KEY não definida.'
      );
    }

    if (!s3Config.bucketName) {
      throw new Error('Variável de ambiente S3_BUCKET não definida.');
    }

    const connection = postgres(process.env.DATABASE_URL as string);
    const db = drizzle(connection);

    // Criação do cliente S3
    const s3Client = createS3Client(s3Config);
    const embeddingModel = openai.textEmbeddingModel('text-embedding-3-small');
    const chatModel = openai('gpt-5-nano');

    console.log('📄 Lendo o arquivo PDF...');

    const filePath =
      './src/scripts/uploads/Edital_05_2024_COPERPS_PS2025_retificado_v3.pdf';
    const filename = path.basename(filePath);
    const fileBody = await fs.readFile(filePath);

    const s3Key = `uploads/${filename}`;
    const fileExists = await checkFileExists(
      s3Client,
      s3Config.bucketName,
      s3Key
    );

    if (fileExists) {
      console.log(
        '⚠️ Arquivo já existe no S3. Continuando com o processamento...'
      );
    } else {
      console.log('📤 Fazendo upload do arquivo para S3...');

      try {
        await uploadFileToS3(
          s3Client,
          s3Config.bucketName,
          s3Key,
          fileBody,
          'application/pdf'
        );

        console.log('✅ Upload para S3 concluído!');
        console.log(`📁 Arquivo salvo em: ${s3Key}`);
      } catch (uploadError) {
        console.error('❌ Erro no upload para S3:', uploadError);
        throw uploadError;
      }
    }

    console.log('🔍 Extraindo metadados e carregando páginas com PDFLoader...');

    const loader = new PDFLoader(filePath);
    const pageLevelDocs = await loader.load();
    const numPages = pageLevelDocs.length;

    const parsedPdfData = await pdf(await fs.readFile(filePath));
    const fileLevelMetadata = parsedPdfData.info;

    console.log('🧠 Gerando categoria e descrição com IA...');

    const fullTextForAI = pageLevelDocs
      .map((doc) => doc.pageContent)
      .join('\n');

    const { object: fileAiMetadata } = await generateObject({
      model: chatModel,
      schema: z.object({
        category: z
          .string()
          .describe(
            'Sugira uma categoria para o documento ("Edital", "Edital Retificado", "Nota de aviso", "Homologação", "Resultado").'
          ),
        description: z
          .string()
          .describe('Crie uma descrição concisa do documento. '),
      }),
      prompt: `Analise as seguinte informações e gere uma categoria e uma descrição: 
      
      Nome do arquivo: "${filename}"
      Número de páginas: ${numPages}
      Início do conteúdo: "${fullTextForAI.substring(0, 4000)}"
      `,
    });

    console.log('💾 Salvando metadados do arquivo principal...');

    const [fileRecord] = await db
      .insert(file)
      .values({
        filename,
        url: s3Key,
        category: fileAiMetadata.category,
        description: fileAiMetadata.description,
        pages: numPages,
        metadata: fileLevelMetadata,
      })
      .returning();

    console.log(`✅ Registro do arquivo salvo com ID: ${fileRecord.id}`);

    console.log(
      '🔪 Dividindo o texto e calculando posições (caractere e linha)...'
    );

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 750,
      chunkOverlap: 150,
    });

    const documentsToProcess: {
      content: string;
      metadata: {
        pageNumber: number;
        loc: {
          characters: {
            from: number;
            to: number;
          };
          lines: {
            from: number;
            to: number;
          };
        };
      };
    }[] = [];

    for (const doc of pageLevelDocs) {
      const pageText = doc.pageContent;
      const pageNumber = doc.metadata.loc.pageNumber;
      const chunks = await splitter.splitText(pageText);

      let searchStartIndex = 0;

      for (const chunkContent of chunks) {
        const startIndex = pageText.indexOf(chunkContent, searchStartIndex);

        if (startIndex === -1) {
          continue;
        }

        const endIndex = startIndex + chunkContent.length;
        const startLine = pageText.substring(0, startIndex).split('\n').length;
        const endLine = pageText.substring(0, endIndex).split('\n').length;

        documentsToProcess.push({
          content: chunkContent,
          metadata: {
            pageNumber,
            loc: {
              characters: {
                from: startIndex,
                to: endIndex,
              },
              lines: {
                from: startLine,
                to: endLine,
              },
            },
          },
        });

        searchStartIndex = startIndex + 1;
      }
    }

    console.log(
      `✅ Texto dividido em ${documentsToProcess.length} chunks com metadados de posição.`
    );

    console.log('🔢 Gerando embeddings para cada chunk...');
    const chunksContent = documentsToProcess.map((doc) => doc.content);
    const { embeddings } = await embedMany({
      model: embeddingModel,
      values: chunksContent,
    });

    if (embeddings.length !== documentsToProcess.length) {
      throw new Error('A contagem de embeddings e chunks não corresponde.');
    }

    console.log(`✅ ${embeddings.length} embeddings gerados.`);

    console.log('💾 Salvando chunks e embeddings no banco de dados...');
    const documentsToInsert = documentsToProcess.map((doc, index) => ({
      fileId: fileRecord.id,
      content: doc.content,
      embedding: embeddings[index],
      metadata: doc.metadata,
    }));

    await db.insert(fileChunk).values(documentsToInsert);

    console.log('🎉 Processo finalizado com sucesso!');
  } catch (error) {
    console.error('❌ Ocorreu um erro no script:', error);
  }
})();
