import { Skeleton } from '@/components/ui/skeleton'

export function ChatLoading() {
  return (
    <div className="space-y-4 md:space-y-6">
      <Skeleton className="ml-auto h-8 max-w-[50%]" />
      <Skeleton className="h-8 max-w-[70%]" />
      <Skeleton className="ml-auto h-8 max-w-[80%]" />
      <div className="space-y-2">
        <Skeleton className="h-8 max-w-[90%]" />
        <Skeleton className="h-8 max-w-[80%]" />
      </div>
      <Skeleton className="ml-auto h-8 max-w-[70%]" />
      <div className="space-y-2">
        <Skeleton className="h-8 max-w-[50%]" />
        <Skeleton className="h-8 max-w-[70%]" />
        <Skeleton className="h-8 max-w-[75%]" />
      </div>
      <Skeleton className="ml-auto h-8 max-w-[35%]" />
    </div>
  )
}
