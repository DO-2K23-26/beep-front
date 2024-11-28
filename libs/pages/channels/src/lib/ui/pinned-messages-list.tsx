import { MessageEntity } from '@beep/contracts'
import React from 'react'
import MessageFeature from '../feature/message-feature'
import { EmptyPinnedMessageList } from './empty-pinned-message-list'

interface PinnedMessagesListProps {
  messages: MessageEntity[]
}

const PinnedMessagesList: React.FC<PinnedMessagesListProps> = ({
  messages,
}) => {
  return (
    <div
      className={`flex absolute flex-col-reverse overflow-y-scroll no-scrollbar scroll-smooth bg-violet-400 rounded-xl h-80 ${
        messages.length > 0 ? 'p-2' : ''
      }`}
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
              isDisplayedAsPinned={true}
            />
          ))
      )}
    </div>
  )
}

export default PinnedMessagesList
