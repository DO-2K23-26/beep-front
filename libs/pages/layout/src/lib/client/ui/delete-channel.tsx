import { ButtonShadCn, InputText } from '@beep/ui'
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
    <div className="flex flex-col gap-y-4 sm:gap-y-8 md:gap-y-12">
      <p className="text-red-600 text-base sm:text-xl md:text-3xl font-bold max-w-sm">
        {t('layout.delete-channel.delete_channel')}
      </p>
      <div className="flex flex-col gap-4">
        <p className="text-slate-600 font-semibold text-xs sm:text-sm md:text-base">
          {t('layout.delete-channel.delete_careful')}
          <u className="text-slate-600 text-xs sm:text-sm md:text-base">
            {t('layout.delete-channel.irreversible_action_warning')}
          </u>
        </p>
        <p className="text-slate-600 font-semibold text-xs sm:text-sm md:text-base">
          {t('layout.delete-channel.type')}
          <strong className="text-red-600">{channelName}</strong>
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
        <ButtonShadCn
          variant={'hoverRounded'}
          className="bg-red-600 text-white text-xs sm:text-sm md:text-base"
          onClick={onSubmit}
        >
          <p className="text-violet-50">{t('layout.delete-channel.delete')}</p>
        </ButtonShadCn>
      </div>
    </div>
  )
}
