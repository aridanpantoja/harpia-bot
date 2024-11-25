import { rateLimiter } from '@/lib/rate-limiter'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const ip = req.ip ?? '127.0.0.1'

  try {
    const { success } = await rateLimiter.limit(ip)

    if (!success) {
      return new NextResponse('Você está digitando mensagens muito rápido', {
        status: 429,
      })
    }

    return NextResponse.next()
  } catch {
    return new NextResponse(
      'Desculpe, estamos enfrentando problemas técnicos no momento. Por favor, tente novamente mais tarde.',
      { status: 500 },
    )
  }
}

export const config = {
  matcher: '/api/chat/:path*',
}
