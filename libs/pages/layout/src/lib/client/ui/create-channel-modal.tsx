import { ChannelType } from '@beep/contracts'
import { Button, ButtonStyle, InputText } from '@beep/ui'
import { Controller, UseFormReturn, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface CreateChannelModalProps {
  closeModal: () => void
  onCreateChannel: () => void
  methodsAddChannel: UseFormReturn<{ name: string; type: ChannelType }>
}

export function CreateChannelModal({
  closeModal,
  onCreateChannel,
  methodsAddChannel,
}: CreateChannelModalProps) {
  const { t } = useTranslation()

  const { control } = useFormContext()

  return (
    <div className="p-6">
      <h3 className=" text-slate-700 font-bold mb-2 max-w-sm">
        {t('layout.create-channel-modal.create_channel')}
      </h3>
      <div className="text-slate-500 text-sm mb-4">
        {t('layout.create-channel-modal.choose_name')}
      </div>
      <Controller
        name="name"
        rules={{
          required: t('layout.create-channel-modal.required_name'),
          minLength: {
            value: 1,
            message: t('layout.create-channel-modal.required_name'),
          },
        }}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <InputText
            className="w-full !rounded-lg min-h-[40px] mb-4"
            label={t('layout.create-channel-modal.channel_input_placeholder')}
            name="name"
            type="text"
            onChange={field.onChange}
            value={field.value}
            error={error?.message}
          />
        )}
      />
      <div className="ml-4 pb-2">
        <input
          id="text"
          className="mr-2"
          type="radio"
          value={ChannelType.TEXT}
          {...methodsAddChannel.register('type')}
        />
        <label htmlFor="text">{t('layout.create-channel-modal.text')}</label>
      </div>
      <div className="ml-4 pb-6">
        <input
          id="voice"
          className="mr-2"
          type="radio"
          value={ChannelType.VOICE}
          {...methodsAddChannel.register('type')}
        />
        <label htmlFor="voice">{t('layout.create-channel-modal.voice')}</label>
      </div>
      <div className="flex gap-3 justify-between">
        <Button
          className="btn--no-min-w"
          style={ButtonStyle.STROKED}
          onClick={() => closeModal()}
        >
          {t('layout.create-channel-modal.cancel')}
        </Button>
        <Button
          className="btn--no-min-w"
          style={ButtonStyle.BASIC}
          onClick={() => {
            onCreateChannel()
          }}
        >
          {t('layout.create-channel-modal.create')}
        </Button>
      </div>
    </div>
  )
}
