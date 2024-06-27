import { Control, Controller, UseFormRegister } from 'react-hook-form'
import { BaseSyntheticEvent, ChangeEvent } from 'react'
import { Button, InputPicture, InputText, InputTextArea } from '@beep/ui'
import { AddServerForm, CreateServerForm } from '../../feature/add-server-feature'

interface CreateServerModalProps {
  register: UseFormRegister<AddServerForm>
  control: Control<AddServerForm, any>
  onSubmit: (e: BaseSyntheticEvent) => Promise<void>
  loading: boolean
  closeModal: () => void
  visibility: 'private' | 'public'
}

export default function CreateServerModal({
  register,
  onSubmit,
  control,
  loading,
  closeModal,
  visibility,
}: CreateServerModalProps): JSX.Element {
  return (
    <div className="p-7 flex flex-col gap-3">
      <h3 className="font-bold">Build your {visibility} server</h3>
      <p>
        Let's give your server some juice ! Keep in mind that you can edit your
        server later.
      </p>
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <span className="flex items-center justify-center">
          <Controller
            name="icon"
            control={control}
            render={({ field }) => (
              <InputPicture
                value={field.value}
                onChange={(e) => field.onChange(e.target.files[0])}
                label="Add a picture."
              />
            )}
          />
        </span>
        <Controller
          name="serverName"
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
              label="Server name"
              type="text"
              name="serverName"
              className="w-full !rounded-lg min-h-[40px]"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        ></Controller>
        <Controller
          name="description"
          rules={{
            required: 'Please describe in a few words your server',
            minLength: {
              value: 1,
              message: 'Please describe in a few words your server',
            },
          }}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <InputTextArea
              label="Tell us more about your server..."
              name="description"
              className="w-full !rounded-lg min-h-[40px]"
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
            />
          )}
        ></Controller>

        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col w-1/4">
            <Button
              loading={loading}
              onClick={closeModal}
              className="!bg-violet-50 group hover:!bg-slate-900 w-full !rounded-lg min-h-[40px] !border-slate-300 hover:!border-slate-900 border-2"
            >
              <p className="text-slate-900 group-hover:text-violet-50">
                Cancel
              </p>
            </Button>
          </div>

          <div className="flex flex-col w-1/4">
            <Button
              type="submit"
              loading={loading}
              className="!bg-slate-800 hover:!bg-slate-900 w-full !rounded-lg min-h-[40px]"
            >
              <p className="text-violet-50">Create</p>
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
