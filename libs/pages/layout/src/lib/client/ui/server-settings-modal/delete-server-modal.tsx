import { Button, InputText } from '@beep/ui'
import { ChangeEvent } from 'react'

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
  return (
    <div className="p-7 flex flex-col gap-4">
      <h3 className="font-bold text-red-600">Destroy your server</h3>
      <p className="text-slate-600 font-semibold">
        Be careful you’re about to delete your server !{' '}
        <u className="text-slate-600">
          You won’t be able to recover your messages/files after this action.
        </u>
      </p>
      <p className="text-slate-600 font-semibold">
        Type <strong className="text-red-600">{confirmationWord}</strong> to
        confirm the deletion.
      </p>
      <InputText
        label="Your server's name"
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
          <p className="text-slate-900 group-hover:text-slate-800">Cancel</p>
        </Button>
        <Button
          className="!bg-red-600 hover:!bg-red-700 !rounded-lg min-h-[40px]"
          onClick={onSubmit}
          loading={loading}
        >
          <p className="text-violet-50">Destroy</p>
        </Button>
      </span>
    </div>
  )
}
