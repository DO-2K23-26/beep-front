import { ChannelEntity } from "@beep/contracts"
import { Button, ButtonStyle } from "@beep/ui"
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation()
  return (
    <div className="p-6">
      <h3 className=" text-slate-700 font-bold mb-2 max-w-sm">
        Delete channel
      </h3>
      <div className="text-slate-500 text-sm mb-4">
        {t("channels.delete-message-modal.description")}
        <strong className="text-red-600"> {channel.name}</strong> ?
      </div>
      <div className="flex flex-row justify-end gap-2">
        <Button
          style={ButtonStyle.STROKED}
          onClick={() => closeModal()}
        >
          {t("channels.delete-message-modal.cancel")}
        </Button>
        <Button
          style={ButtonStyle.ERROR}
          onClick={() => {
            onDeleteChannel(
              channel.id
            )
          }}
        >
          {t("channels.delete-message-modal.delete")}
        </Button>
      </div>
    </div>
  )
}
