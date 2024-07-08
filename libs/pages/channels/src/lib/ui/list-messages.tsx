import {
  ChannelEntity,
  MessageEntity,
  UserDisplayedEntity,
} from '@beep/contracts'
import MessageFeature from '../feature/message-feature'

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
  findChannelForTag: (tag: string) => ChannelEntity | undefined
  selectedTaggedChannel: ChannelEntity | undefined
  setSelectedTaggedChannel: React.Dispatch<
    React.SetStateAction<ChannelEntity | undefined>
  >
}

export default function ListMessages({
  messages,
  onUpdateMessage,
  onReply,
  onDeleteMessage,
  editingMessageId,
  setEditingMessageId,
  selectedTaggedUser,
  setSelectedTaggedUser,
  findChannelForTag,
  selectedTaggedChannel,
  setSelectedTaggedChannel,
}: ListMessagesProps) {
  return (
    <div className="flex flex-col-reverse gap-6 overflow-y-scroll no-scrollbar scroll-smooth h-full">
      {messages &&
        messages
          .slice()
          .map((message) => (
            <MessageFeature
              key={message.id}
              user={message.owner}
              onUpdateMessage={onUpdateMessage}
              onDeleteMessage={onDeleteMessage}
              createdAt={message.createdAt || ''}
              message={message}
              editingMessageId={editingMessageId}
              setEditingMessageId={setEditingMessageId}
              isPinned={false}
              selectedTaggedUser={selectedTaggedUser}
              setSelectedTaggedUser={setSelectedTaggedUser}
              findChannelForTag={findChannelForTag}
              selectedTaggedChannel={selectedTaggedChannel}
              setSelectedTaggedChannel={setSelectedTaggedChannel}
              onReply={() => {
                onReply(message)
              }}
            />
          ))}
    </div>
  )
}
