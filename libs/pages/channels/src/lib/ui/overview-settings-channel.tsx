import { ButtonShadCn, InputText, InputTextArea } from '@beep/ui'
import { Controller, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface OverviewSettingsChannelProps {
  handleSave: () => void
  handleReset: () => void
  form: UseFormReturn<{ channelName: string; channelDescription: string }>
}

export function OverviewSettingsChannel({
  handleSave,
  handleReset,
  form,
}: Readonly<OverviewSettingsChannelProps>) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-y-4 sm:gap-y-6 md:gap-y-8">
      <p className="text-slate-700 font-bold mb-2 max-w-sm text-base sm:text-xl md:text-3xl">
        {t('layout.overview-settings-channel.overview')}
      </p>

      <div className="flex flex-col">
        <Controller
          control={form.control}
          name="channelName"
          rules={{
            required: t(
              'layout.overview-settings-channel.required_name_channel'
            ),
            pattern: {
              value: /^(?!\s).*$/, // Check for empty spaces at the beginning of the string
              message: t(
                'layout.overview-settings-channel.invalid_name_channel'
              ),
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <InputText
              label={t('layout.overview-settings-channel.channel_name')}
              type="text"
              name="channel-name"
              className="!w-7/10 !rounded-lg"
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
            />
          )}
        />
      </div>

      <div className="flex flex-col">
        <Controller
          control={form.control}
          name="channelDescription"
          render={({ field, fieldState: { error } }) => (
            <InputTextArea
              label={t('layout.overview-settings-channel.channel_description')}
              name="channel-description"
              className="!w-7/10 !rounded-lg min-h-10"
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
            />
          )}
        />
      </div>

      <div className="flex flex-row justify-start sm:justify-end gap-2">
        <ButtonShadCn
          variant={'hoverRounded'}
          className="bg-red-600 text-white text-xs sm:text-sm md:text-base"
          onClick={handleReset}
        >
          {t('layout.overview-settings-channel.reset')}
        </ButtonShadCn>
        <ButtonShadCn
          variant={'hoverRounded'}
          className="bg-violet-400 text-xs sm:text-sm md:text-base"
          onClick={handleSave}
        >
          {t('layout.overview-settings-channel.save')}
        </ButtonShadCn>
      </div>
    </div>
  )
}
