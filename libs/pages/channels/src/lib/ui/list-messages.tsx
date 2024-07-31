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
