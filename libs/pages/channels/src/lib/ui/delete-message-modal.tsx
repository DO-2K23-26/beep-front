import { Button, ButtonStyle } from '@beep/ui'
import { useTranslation } from 'react-i18next'

interface DeleteMessageModalProps {
  closeModal: () => void
  onDeleteMessage: () => void
}

export function DeleteMessageModal({
  closeModal,
  onDeleteMessage,
}: DeleteMessageModalProps) {
  const { t } = useTranslation()

  return (
    <div className="p-6">
      <h3 className=" text-slate-700 font-bold mb-2 max-w-sm">
        {t('channels.delete-message-modal.title')}
      </h3>
      <div className="text-slate-500 text-sm mb-4">
        {t('channels.delete-message-modal.description')}
      </div>
      <div className="flex gap-3 justify-between">
        <Button
          className="btn--no-min-w"
          style={ButtonStyle.STROKED}
          onClick={() => closeModal()}
        >
          {t('channels.delete-message-modal.cancel')}
        </Button>
        <Button
          className="btn--no-min-w"
          style={ButtonStyle.ERROR}
          onClick={() => {
            onDeleteMessage()
            closeModal()
          }}
        >
          {t('channels.delete-message-modal.delete')}
        </Button>
      </div>
    </div>
  )
}
