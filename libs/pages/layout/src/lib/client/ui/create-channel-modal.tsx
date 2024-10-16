import { ChannelType } from '@beep/contracts'
import { Button, ButtonStyle, InputText } from '@beep/ui'
import { Controller, UseFormReturn, useFormContext } from 'react-hook-form'

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
  const { control } = useFormContext()

  return (
    <div className="p-6">
      <h3 className=" text-slate-700 font-bold mb-2 max-w-sm">
        Create channel
      </h3>
      <div className="text-slate-500 text-sm mb-4">
        Choose a name for your channel
      </div>
      <Controller
        name="name"
        rules={{
          required: 'Please enter a name.',
          minLength: {
            value: 1,
            message: 'Please enter a name.',
          },
        }}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <InputText
            className="w-full !rounded-lg min-h-[40px] mb-4"
            label={'Channel name'}
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
        <label htmlFor="text">Text</label>
      </div>
      <div className="ml-4 pb-6">
        <input
          id="voice"
          className="mr-2"
          type="radio"
          value={ChannelType.VOICE}
          {...methodsAddChannel.register('type')}
        />
        <label htmlFor="voice">Voice</label>
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
          style={ButtonStyle.BASIC}
          onClick={() => {
            onCreateChannel()
          }}
        >
          Create
        </Button>
      </div>
    </div>
  )
}
