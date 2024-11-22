import { Button, ButtonStyle, InputText, InputTextArea } from '@beep/ui'
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
    <div className="flex flex-col gap-y-12">
      <p className="text-slate-700 text-3xl font-bold mb-2 max-w-sm">
        {t('layout.overview-settings-channel.overview')}
      </p>

      <div className="flex flex-col">
        <p className="text-slate-700 font-bold text-2xl mb-2 max-w-sm">Name</p>
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
              className="!w-7/10 !rounded-lg min-h-[40px]"
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
            />
          )}
        />
      </div>

      <div className="flex flex-col">
        <p className="text-slate-700 font-bold text-2xl mb-2 max-w-sm">
          {t('layout.overview-settings-channel.description')}
        </p>
        <Controller
          control={form.control}
          name="channelDescription"
          render={({ field, fieldState: { error } }) => (
            <InputTextArea
              label={t('layout.overview-settings-channel.channel_description')}
              name="channel-description"
              className="!w-7/10 !rounded-lg min-h-[40px]"
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
            />
          )}
        />
      </div>

      <div className="flex flex-row justify-between">
        <Button style={ButtonStyle.BASIC} onClick={handleSave}>
          {t('layout.overview-settings-channel.save')}
        </Button>
        <Button style={ButtonStyle.BASIC} onClick={handleReset}>
          {t('layout.overview-settings-channel.reset')}
        </Button>
      </div>
    </div>
  )
}
