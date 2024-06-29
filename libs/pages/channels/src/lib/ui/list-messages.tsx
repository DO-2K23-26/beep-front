import { MessageEntity } from '@beep/contracts'
import MessageFeature from '../feature/message-feature'
import { useState } from 'react'

interface ListMessagesProps {
  messages: MessageEntity[]
  onUpdateMessage: (messageId: string, newContent: string) => void
  control: any
}

export default function ListMessages({ messages, onUpdateMessage, control }: ListMessagesProps) {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
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
              control={control}
              editingMessageId={editingMessageId}
              setEditingMessageId={setEditingMessageId}
              isPinned= {false}
            />
          ))}
    </div>
  )
}
