import { useMutation, useQueryClient } from '@tanstack/react-query';
import { voteService } from '@/services/vote';

type useVoteProps = {
  chatId: string;
  messageId: string;
};

export function useVote({ chatId, messageId }: useVoteProps) {
  const queryClient = useQueryClient();

  const voteMutation = useMutation({
    mutationFn: async ({ type }: { type: 'up' | 'down' }) =>
      voteService.vote({ chatId, messageId, type }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['votes', chatId] });
    },
  });

  return voteMutation;
}
