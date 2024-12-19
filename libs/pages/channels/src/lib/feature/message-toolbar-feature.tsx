import { useDeleteMessageMutation, usePinMessageMutation } from '@beep/channel'
import { useContext, useEffect } from 'react'
import toast from 'react-hot-toast'
import { MessageToolbar } from '../ui/message-toolbar'
import { MessageContext } from './message-feature'

export function MessageToolbarFeature() {
  const {
    message,
    isEditing,
    isDisplayedAsPinned,
    currentUserIsOwner,
    switchEditing,
    cancelEditing,
    onReply,
  } = useContext(MessageContext)
  const [pinMessage, result] = usePinMessageMutation()
  const [deleteMessage] = useDeleteMessageMutation()

  const onPin = async () => {
    pinMessage({
      channelId: message.channelId,
      messageId: message.id,
      action: message.pinned ? 'unpin' : 'pin',
    })
  }

  const onDeleteMessage = () => {
    deleteMessage({
      channelId: message.channelId,
      messageId: message.id,
    })
  }

  useEffect(() => {
    const pinning = message.pinned ? 'pin' : 'unpin'
    if (result.error) {
      toast.error(
        `Failure while trying to ${pinning}
         the message`
      )
    } else if (result.isSuccess) {
      toast.success(`Message ${pinning}!`)
    }
  }, [message.pinned, result])

  return (
    <MessageToolbar
      isEditing={isEditing}
      isDisplayedAsPinned={isDisplayedAsPinned}
      currentUserIsOwner={currentUserIsOwner}
      cancelEditing={cancelEditing}
      switchEditing={switchEditing}
      onPin={onPin}
      onDelete={onDeleteMessage}
      onReply={onReply}
    />
  )
}
