import { Icon } from '@beep/ui'
import { useContext } from 'react'
import { MessageContext } from '../feature/message-feature'

export function ReplyToDisplay() {
  const { message, replaceUserTag } = useContext(MessageContext)

  const renderedReplyedMessage = message
    ? replaceUserTag(
        message?.parentMessage?.content.substring(0, 50) +
          (message?.parentMessage?.content?.length ?? 0 > 50 ? ' ...' : '')
      )
    : undefined
  if (!message.parentMessage) return null
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
