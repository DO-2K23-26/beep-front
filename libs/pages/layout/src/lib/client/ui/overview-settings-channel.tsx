import { Button, ButtonStyle, InputText, InputTextArea } from '@beep/ui'
import { Controller, UseFormReturn } from 'react-hook-form';

interface OverviewSettingsChannelProps {
  handleSave: () => void,
  handleReset: () => void,
  form:  UseFormReturn<{channelName: string, channelDescription: string}>
}

export function OverviewSettingsChannel({
  handleSave,
  handleReset,
  form,
}: Readonly<OverviewSettingsChannelProps>) {
  return (
    <div className="flex flex-col gap-y-12">
      <p className="text-slate-700 text-3xl font-bold mb-2 max-w-sm">
        Overview
      </p>

      <div className="flex flex-col">
        <p className="text-slate-700 font-bold text-2xl mb-2 max-w-sm">Name</p>
        <Controller
          control={form.control}
          name="channelName"
          rules={{
            required: 'Channel name is required',
            pattern: {
              value: /^(?!\s).*$/, // Check for empty spaces at the beginning of the string
              message: 'Channel name must not start with empty spaces',
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <InputText
              label="Channel name"
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
          Description
        </p>
        <Controller
          control={form.control}
          name="channelDescription"
          render={({ field, fieldState: { error } }) => (
            <InputTextArea
              label="Channel description"
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
          SAVE
        </Button>
        <Button style={ButtonStyle.BASIC} onClick={handleReset}>
          RESET
        </Button>
      </div>
    </div>
  )
}
