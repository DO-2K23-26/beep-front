import { MessageEntity, UserDisplayedEntity } from '@beep/contracts'
import MessageFeature from '../feature/message-feature'
import { useState } from 'react'

interface ListMessagesProps {
  messages: MessageEntity[]
  onUpdateMessage: (messageId: string, newContent: string) => void
  editingMessageId: string | null
  setEditingMessageId: React.Dispatch<React.SetStateAction<string | null>>
  findUserForTag: (value: string) => UserDisplayedEntity | undefined
  selectedTaggedUser: UserDisplayedEntity | undefined
  setSelectedTaggedUser: React.Dispatch<React.SetStateAction<UserDisplayedEntity | undefined>>
}

export default function ListMessages({ messages, onUpdateMessage, editingMessageId, setEditingMessageId, findUserForTag, selectedTaggedUser, setSelectedTaggedUser }: ListMessagesProps) {
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
              createdAt={message.createdAt || ''}
              message={message}
              editingMessageId={editingMessageId}
              setEditingMessageId={setEditingMessageId}
              isPinned= {false}
              findUserForTag={findUserForTag}
              selectedTaggedUser={selectedTaggedUser}
              setSelectedTaggedUser={setSelectedTaggedUser}
            />
          ))}
    </div>
  )
}
