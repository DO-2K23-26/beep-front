import { MessageEntity } from '@beep/contracts'
import MessageFeature from '../feature/message-feature'

interface ListMessagesProps {
  messages: MessageEntity[]
}

export default function ListMessages({ messages }: ListMessagesProps) {
  return (
    <div className="flex flex-col-reverse gap-6 overflow-y-scroll no-scrollbar scroll-smooth">
      {messages &&
        messages
          .slice()
          .reverse()
          .map((message) => (
            <MessageFeature
              key={message.id}
              user={message.owner}
              createdAt={message.createdAt || ''}
              message={message.content}
            />
          ))}
    </div>
  )
}
