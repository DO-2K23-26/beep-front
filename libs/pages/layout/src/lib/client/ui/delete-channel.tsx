import { Button, InputText } from '@beep/ui'
import { ChangeEvent } from 'react'

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

  return (
    <div className="flex flex-col gap-y-12">
      <p className="text-red-600 text-3xl font-bold max-w-sm">
        Delete this channel
      </p>
      <div className="flex flex-col gap-4">
        <p className="text-slate-600 font-semibold">Be careful you’re about to delete this channel!{' '}
        <u className="text-slate-600">
          You won’t be able to recover your messages/files after this action.
        </u>
        </p>
        <p className="text-slate-600 font-semibold">
          Type <strong className="text-red-600">{channelName}</strong> to
          confirm the deletion.
        </p>
        <InputText
          label="Name of the channel"
          name="confirmation"
          value={confirmationText}
          onChange={onChange}
          error={error}
        />
      </div>
      <div className="flex flex-row justify-end">
        <Button className="!bg-red-600 hover:!bg-red-700 !rounded-lg min-h-[40px]" onClick={onSubmit} loading={loading}>
            <p className="text-violet-50">Delete</p>
        </Button>
      </div>
    </div>
  )
}