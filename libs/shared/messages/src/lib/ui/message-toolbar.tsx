import { Button, ButtonStyle, Icon } from '@beep/ui'
import { DeleteMessageDialog } from './delete-message-dialog'
import { RotateCcw } from 'lucide-react'

export interface MessageToolbarProps {
  isEditing?: boolean
  isDisplayedAsPinned?: boolean
  currentUserIsOwner?: boolean
  isErrorCreate?: boolean
  switchEditing?: () => void
  onDelete?: () => void
  onPin: () => void
  onReply?: () => void
  retryMessage?: () => void
  cancelEditing?: () => void
}
export function MessageToolbar({
  isEditing,
  isDisplayedAsPinned,
  currentUserIsOwner,
  isErrorCreate,
  switchEditing,
  onDelete,
  onPin,
  onReply,
  retryMessage,
  cancelEditing,
}: MessageToolbarProps) {
  if (isDisplayedAsPinned) return
  if (isErrorCreate) {
    return (
      <div className="flex flex-row gap-2 sm:gap-4 items-center visible pr-2">
        <span className="text-red-500 text-[10px] sm:text-xs">ⓘ Failed to send message</span>
        <Button style={ButtonStyle.NONE} onClick={retryMessage}>
          <RotateCcw color="#ff6240" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-row gap-4 items-center sm:invisible group-hover:visible pr-2">
      {switchEditing && !isEditing && currentUserIsOwner && (
        <Button style={ButtonStyle.NONE} onClick={switchEditing}>
          <Icon name="lucide:pencil" className="w-4 h-4" />
        </Button>
      )}
      {onDelete && currentUserIsOwner && (
        <DeleteMessageDialog onDeleteMessage={onDelete}>
          <Icon name="lucide:trash" className="w-4 h-4" />
        </DeleteMessageDialog>
      )}
      <Button style={ButtonStyle.NONE} onClick={onPin}>
        <Icon name="lucide:pin" className="w-5 h-5" />
      </Button>
      {onReply && (
        <Button style={ButtonStyle.NONE} onClick={onReply}>
          <Icon name="lucide:corner-up-left" className="w-5 h-5" />
        </Button>
      )}
      {isEditing && (
        <Button style={ButtonStyle.NONE} onClick={cancelEditing}>
          <Icon name="lucide:x" className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}
