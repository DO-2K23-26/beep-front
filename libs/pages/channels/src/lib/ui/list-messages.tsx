import { MessageEntity } from '@beep/contracts'
import MessageFeature from '../feature/message-feature'
import { ListMessageSkeleton } from './list-message-skeleton'

interface ListMessagesProps {
  messages: MessageEntity[]
  editingMessageId: string | null
  setEditingMessageId: React.Dispatch<React.SetStateAction<string | null>>
  isLoading: boolean
  messageListRef: React.RefObject<HTMLDivElement>
  onScroll: () => void
  onReply: (message: MessageEntity) => void
  serverId?: string
}

export default function ListMessages({
  messages,
  isLoading,
  messageListRef,
  serverId,
  editingMessageId,
  onReply,
  onScroll,
  setEditingMessageId,
}: ListMessagesProps) {
  return (
    <div className="relative h-full w-full">
      <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-violet-200 to-transparent pointer-events-none z-10"></div>
      <div
        onScroll={onScroll}
        ref={messageListRef}
        className="flex top-0 absolute flex-col-reverse gap-2 md:gap-4 overflow-y-scroll no-scrollbar scroll-smooth h-full w-full"
      >
        {messages.map((message) => (
          <MessageFeature
            key={message.id}
            message={message}
            editingMessageId={editingMessageId}
            onReply={() => onReply(message)}
            setEditingMessageId={setEditingMessageId}
            serverId={serverId}
          />
        ))}
        {isLoading && <ListMessageSkeleton />}
      </div>
    </div>
  )
}
