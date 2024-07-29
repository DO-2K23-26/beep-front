import { MessageSkeleton } from './message-skeleton'

export function ListMessageSkeleton() {
  return (
    <div className="flex flex-col-reverse gap-6 overflow-y-scroll no-scrollbar scroll-smooth h-full">
      {Array.from({ length: 6 }).map((_, index) => (
        <MessageSkeleton key={index} />
      ))}
    </div>
  )
}
