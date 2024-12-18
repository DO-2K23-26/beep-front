import { MessageEntity } from '@beep/contracts'
import { Icon } from '@beep/ui'
import { ReactNode } from 'react'

interface ReplyToDisplayProps {
  message?: MessageEntity | null
  replaceTagEntity: (content: ReactNode) => ReactNode
}

export function ReplyToDisplay({
  message,
  replaceTagEntity,
}: ReplyToDisplayProps) {
  const renderedReplyedMessage = message
    ? replaceTagEntity(
        message.content.substring(0, 50) +
          (message.content.length > 50 ? ' ...' : '')
      )
    : undefined
  return (
    message && (
      <div className={'flex items-center ml-4 opacity-60'}>
        <Icon name="lucide:corner-up-right" className="w-4 h-4 mr-2" />
        <div className="reply-to bg-violet-100 p-2 rounded">
          <span className="text-sm text-gray-600">
            <strong>{message.owner?.username}</strong> :{' '}
            <i>{renderedReplyedMessage}</i>
          </span>
        </div>
      </div>
    )
  )
}
