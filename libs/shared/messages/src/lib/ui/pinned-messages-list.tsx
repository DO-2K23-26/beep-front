import { MessageEntity } from '@beep/contracts'
import { cn } from '@beep/utils'
import MessageFeature from '../feature/message-feature'
import { EmptyPinnedMessageList } from './empty-pinned-message-list'

interface PinnedMessagesListProps {
  messages: MessageEntity[]
  serverId?: string
}

function PinnedMessagesList({
  messages,
  serverId,
}: PinnedMessagesListProps) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse overflow-y-scroll no-scrollbar scroll-smooth bg-violet-400 rounded-md max-h-80',
        {
          'p-2': messages.length > 0,
        }
      )}
    >
      {messages.length === 0 ? (
        <EmptyPinnedMessageList />
      ) : (
        messages
          .slice()
          .map((message) => (
            <MessageFeature
              key={'pinned' + message.id}
              message={message}
              serverId={serverId}
              isDisplayedAsPinned={true}
            />
          ))
      )}
    </div>
  )
}

export default PinnedMessagesList
