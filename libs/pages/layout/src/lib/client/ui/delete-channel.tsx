import { Button, InputText } from '@beep/ui'
import { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'

interface DeleteChannelProps {
  channelName: string
  confirmationText: string
  onChange: (value: ChangeEvent<HTMLInputElement>) => void
  onSubmit: () => void
  error: string | undefined
  loading: boolean
}

export function DeleteChannel({
  channelName,
  confirmationText,
  onChange,
  onSubmit,
  error,
  loading,
}: Readonly<DeleteChannelProps>) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-y-12">
      <p className="text-red-600 text-3xl font-bold max-w-sm">
        {t('layout.delete-channel.delete-channel')}
      </p>
      <div className="flex flex-col gap-4">
        <p className="text-slate-600 font-semibold">
          {' '}
          {t('layout.delete-channel.delete_careful')}{' '}
          <u className="text-slate-600">
            {t('layout.delete-channel.irreversible_action_warning')}
          </u>
        </p>
        <p className="text-slate-600 font-semibold">
          {t('layout.delete-channel.type')}{' '}
          <strong className="text-red-600">{channelName}</strong>{' '}
          {t('layout.delete-channel.confirm_delete')}
        </p>
        <InputText
          label={t('layout.delete-channel.channel_name')}
          name="confirmation"
          value={confirmationText}
          onChange={onChange}
          error={error}
        />
      </div>
      <div className="flex flex-row justify-end">
        <Button
          className="!bg-red-600 hover:!bg-red-700 !rounded-lg min-h-[40px]"
          onClick={onSubmit}
          loading={loading}
        >
          <p className="text-violet-50">{t('layout.delete-channel.delete')}</p>
        </Button>
      </div>
    </div>
  )
}
