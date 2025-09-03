import { ThumbsDown } from 'lucide-react';
import { useVote } from '@/hooks/use-vote';
import type { Vote } from '@/lib/db/schema';
import { TooltipButton } from '../common/tooltip-button';

type DownvoteButtonProps = {
  chatId: string;
  messageId: string;
  vote: Vote | undefined;
};

export function DownvoteButton({
  chatId,
  messageId,
  vote,
}: DownvoteButtonProps) {
  const { mutateAsync, isPending } = useVote({ chatId, messageId });

  return (
    <TooltipButton
      content="Descurtir"
      disabled={vote?.isUpvoted === false || isPending}
      onClick={() => mutateAsync({ type: 'down' })}
      size="icon"
      variant="outline"
    >
      <ThumbsDown />
    </TooltipButton>
  );
}
