import { MessageEntity } from '@beep/contracts'
import MessageFeature from '../feature/message-feature'

interface ListMessagesProps {
  messages: MessageEntity[]
  onUpdateMessage: (messageId: string) => void
  control: any
}

export default function ListMessages({ messages, onUpdateMessage, control }: ListMessagesProps) {
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
            />
          ))}
    </div>
  )
}
