import { MemberEntity, MessageEntity } from '@beep/contracts'
import React from 'react'
import MessageFeature from '../feature/message-feature'
import { EmptyPinnedMessageList } from './empty-pinned-message-list'
import { cn } from '@beep/utils'

interface PinnedMessagesListProps {
  messages: MessageEntity[]
  serverId?: string
  usersServer?: MemberEntity[]
}

function PinnedMessagesList({
  messages,
  serverId,
  usersServer,
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
              usersServer={usersServer ?? []}
            />
          ))
      )}
    </div>
  )
}

export default PinnedMessagesList
