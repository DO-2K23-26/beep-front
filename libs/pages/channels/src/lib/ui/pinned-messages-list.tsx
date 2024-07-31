import React from 'react'
import MessageFeature from '../feature/message-feature'
import {
  ChannelEntity,
  MessageEntity,
  UserDisplayedEntity,
} from '@beep/contracts'

interface PinnedMessagesListProps {
  messages: MessageEntity[]
  onUpdateMessage: (messageId: string, newContent: string) => void
  editingMessageId: string | null
  setEditingMessageId: (id: string | null) => void
  selectedTaggedUser: UserDisplayedEntity | undefined
  setSelectedTaggedUser: React.Dispatch<
    React.SetStateAction<UserDisplayedEntity | undefined>
  >
}

const PinnedMessagesList: React.FC<PinnedMessagesListProps> = ({
  messages,
  onUpdateMessage,
  editingMessageId,
  setEditingMessageId,
  selectedTaggedUser,
  setSelectedTaggedUser,
}) => {
  return (
    <div
      className={`flex absolute flex-col-reverse overflow-y-scroll no-scrollbar scroll-smooth bg-violet-400 rounded-xl h-80 ${
        messages.length > 0 ? 'p-2' : ''
      }`}
    >
      {messages.slice().map((message) => (
        <MessageFeature
          key={'pinned' + message.id}
          message={message}
          isDisplayedAsPinned={true}
          onUpdateMessage={onUpdateMessage}
          editingMessageId={editingMessageId}
          setEditingMessageId={setEditingMessageId}
          selectedTaggedUser={selectedTaggedUser}
          setSelectedTaggedUser={setSelectedTaggedUser}
          onDeleteMessage={function (
            channelId: string,
            messageId: string
          ): void {
            // not implemented
          }}
          onReply={function (message: MessageEntity): void {
            // not implemented
          }}
          findChannelForTag={function (tag: string): ChannelEntity | undefined {
            // not implemented
            return undefined
          }}
          selectedTaggedChannel={undefined}
        />
      ))}
    </div>
  )
}

export default PinnedMessagesList
