import { Button, InputText } from '@beep/ui'
import { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'

interface DestroyServerModalProps {
  value: string
  onChange: (value: ChangeEvent<HTMLInputElement>) => void
  confirmationWord: string
  closeModal: () => void
  onSubmit: () => void
  error: string | undefined
  loading: boolean
}

export default function DestroyServerModal({
  value,
  onChange,
  confirmationWord,
  closeModal,
  onSubmit,
  error,
  loading,
}: DestroyServerModalProps) {
  const { t } = useTranslation()

  return (
    <div className="p-7 flex flex-col gap-4">
      <h3 className="font-bold text-red-600">
        {t('layout.server-settings-modal.delete-server-modal.destroy_server')}
      </h3>
      <p className="text-slate-600 font-semibold">
        {t('layout.server-settings-modal.delete-server-modal.delete_careful')}{' '}
        <u className="text-slate-600">
          {t(
            'layout.server-settings-modal.delete-server-modal.irreversible_action_warning'
          )}
        </u>
      </p>
      <p className="text-slate-600 font-semibold">
        {t('layout.server-settings-modal.delete-server-modal.type')}
        <strong className="text-red-600">{confirmationWord}</strong>
        {t('layout.server-settings-modal.delete-server-modal.confirm_delete')}
      </p>
      <InputText
        label={t(
          'layout.server-settings-modal.delete-server-modal.server_name'
        )}
        name="confirmation"
        value={value}
        onChange={onChange}
        error={error}
      />
      <span className="flex flex-row justify-between">
        <Button
          className="!bg-violet-50 group hover:!bg-violet-100  !rounded-lg min-h-[40px] !border-slate-300 hover:!border-slate-400 border-2"
          onClick={closeModal}
        >
          <p className="text-slate-900 group-hover:text-slate-800">
            {t('layout.server-settings-modal.delete-server-modal.cancel')}
          </p>
        </Button>
        <Button
          className="!bg-red-600 hover:!bg-red-700 !rounded-lg min-h-[40px]"
          onClick={onSubmit}
          loading={loading}
        >
          <p className="text-violet-50">
            {t('layout.server-settings-modal.delete-server-modal.destroy')}
          </p>
        </Button>
      </span>
    </div>
  )
}
