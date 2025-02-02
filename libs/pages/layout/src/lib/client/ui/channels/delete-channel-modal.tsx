import { ChannelEntity } from "@beep/contracts"
import { Button, ButtonStyle } from "@beep/ui"

interface DeleteChannelModalProps {
  closeModal: () => void
  onDeleteChannel: (channelId: string) => void
  channel: ChannelEntity
}

export function DeleteChannelModal({
  closeModal,
  onDeleteChannel,
  channel,
}: DeleteChannelModalProps) {
  return (
    <div className="p-6">
      <h3 className=" text-slate-700 font-bold mb-2 max-w-sm">
        Delete channel
      </h3>
      <div className="text-slate-500 text-sm mb-4">
        Are you sure you want to delete
        <strong className="text-red-600"> {channel.name}</strong> ?
      </div>
      <div className="flex flex-row justify-end gap-2">
        <Button
          style={ButtonStyle.STROKED}
          onClick={() => closeModal()}
        >
          Cancel
        </Button>
        <Button
          style={ButtonStyle.ERROR}
          onClick={() => {
            onDeleteChannel(
              channel.id
            )
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  )
}
