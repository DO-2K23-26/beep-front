import { Button, ButtonStyle } from '@beep/ui'

interface DeleteMessageModalProps {
  closeModal: () => void
  onDeleteMessage: () => void
}

export function DeleteMessageModal({
  closeModal,
  onDeleteMessage,
}: DeleteMessageModalProps) {
  return (
    <div className="p-6">
      <h3 className=" text-slate-700 font-bold mb-2 max-w-sm">
        Delete Message
      </h3>
      <div className="text-slate-500 text-sm mb-4">
        Are you sure you want to delete this message?
      </div>
      <div className="flex gap-3 justify-between">
        <Button
          className="btn--no-min-w"
          style={ButtonStyle.STROKED}
          onClick={() => closeModal()}
        >
          Cancel
        </Button>
        <Button
          className="btn--no-min-w"
          style={ButtonStyle.ERROR}
          onClick={() => {
            onDeleteMessage()
            closeModal()
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  )
}
