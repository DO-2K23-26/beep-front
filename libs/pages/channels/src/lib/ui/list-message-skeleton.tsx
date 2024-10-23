import { MessageSkeleton } from './message-skeleton'

export function ListMessageSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <MessageSkeleton key={index} />
      ))}
    </>
  )
}
