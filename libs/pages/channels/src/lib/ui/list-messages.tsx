import {
  ChannelEntity,
  MessageEntity,
  UserDisplayedEntity,
} from '@beep/contracts'
import MessageFeature from '../feature/message-feature'
import { ListMessageSkeleton } from './list-message-skeleton'

interface ListMessagesProps {
  messages: MessageEntity[]
  onUpdateMessage: (messageId: string, newContent: string) => void
  onReply: (message: MessageEntity) => void
  onDeleteMessage: (channelId: string, messageId: string) => void
  editingMessageId: string | null
  setEditingMessageId: React.Dispatch<React.SetStateAction<string | null>>
  selectedTaggedUser: UserDisplayedEntity | undefined
  setSelectedTaggedUser: React.Dispatch<
    React.SetStateAction<UserDisplayedEntity | undefined>
  >
  setSelectedTaggedChannel: React.Dispatch<
    React.SetStateAction<ChannelEntity | undefined>
  >
  isLoading: boolean
  messageListRef: React.RefObject<HTMLDivElement>
  onScroll: () => void
}

export default function ListMessages({
  messages,
  isLoading,
  messageListRef,
  onScroll,
  onUpdateMessage,
  onReply,
  onDeleteMessage,
  editingMessageId,
  setEditingMessageId,
  selectedTaggedUser,
  setSelectedTaggedUser,
  setSelectedTaggedChannel,
}: ListMessagesProps) {
  return (
    <div
      onScroll={onScroll}
      ref={messageListRef}
      className="flex flex-col-reverse gap-6 overflow-y-scroll no-scrollbar scroll-smooth h-full"
    >
      {messages.slice().map((message) => (
        <MessageFeature
          key={message.id}
          onUpdateMessage={onUpdateMessage}
          onDeleteMessage={onDeleteMessage}
          message={message}
          editingMessageId={editingMessageId}
          setEditingMessageId={setEditingMessageId}
          selectedTaggedUser={selectedTaggedUser}
          setSelectedTaggedUser={setSelectedTaggedUser}
          setSelectedTaggedChannel={setSelectedTaggedChannel}
          onReply={() => {
            onReply(message)
          }}
        />
      ))}
      {isLoading && <ListMessageSkeleton />}
    </div>
  )
}
