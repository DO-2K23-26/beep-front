import { Control, Controller, UseFormRegister } from 'react-hook-form'
import { CreateServerForm } from '../feature/create-server-feature'
import { BaseSyntheticEvent } from 'react'
import { Button, InputText, InputTextArea } from '@beep/ui'

interface CreateServerModalProps {
  register: UseFormRegister<CreateServerForm>
  control: Control<CreateServerForm, any>
  onSubmit: (e: BaseSyntheticEvent) => Promise<void>
  loading: boolean
}

export default function CreateServerModal({
  register,
  onSubmit,
  control,
  loading,
}: CreateServerModalProps): JSX.Element {
  return (
    <div>
      <h2>Build your server</h2>
      <p>
        Let's give your server some juice ! Keep in mind that you can edit your
        server later.
      </p>
      <form onSubmit={onSubmit}>
        {/* <input {...register('icon')} type="file" /> */}
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
              label="Description"
              name="description"
              className="w-full !rounded-lg min-h-[40px]"
              value={field.value}
              error={error?.message}
            />
          )}
        ></Controller>
        <div>
          <div className="flex flex-col w-full">
            <Button
              type="submit"
              loading={loading}
              className="!bg-slate-800 hover:!bg-slate-900 w-full !rounded-lg min-h-[40px]"
            >
              <p className="text-violet-50">Back</p>
            </Button>
          </div>

          <div className="flex flex-col w-full">
            <Button
              type="submit"
              loading={loading}
              className="!bg-slate-800 hover:!bg-slate-900 w-full !rounded-lg min-h-[40px]"
            >
              <p className="text-violet-50">Create your server</p>
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
