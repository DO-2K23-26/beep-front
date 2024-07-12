import React from 'react'
import MessageFeature from '../feature/message-feature'
import { MessageEntity, UserDisplayedEntity } from '@beep/contracts'

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
    <div className="flex absolute flex-col-reverse overflow-y-scroll no-scrollbar scroll-smooth bg-violet-400 rounded-xl h-80 p-2">
      {messages &&
        messages
          .slice()
          .map((message) => (
            <MessageFeature
              key={message.id}
              user={message.owner}
              message={message}
              onUpdateMessage={onUpdateMessage}
              createdAt={message.createdAt || ''}
              editingMessageId={editingMessageId}
              setEditingMessageId={setEditingMessageId}
              isPinned={true}
              selectedTaggedUser={selectedTaggedUser}
              setSelectedTaggedUser={setSelectedTaggedUser}
            />
          ))}
    </div>
  )
}

export default PinnedMessagesList
