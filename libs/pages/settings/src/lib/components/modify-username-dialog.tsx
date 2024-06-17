import { Button, DialogComponent, InputText } from '@beep/ui'
import { Controller, UseFormReturn } from 'react-hook-form'

interface ModifyUsernameDialogProps {
  usernameFormController: UseFormReturn<{ username: string; }, any, undefined>
  isModalOpen: boolean
  setIsModalOpen: (value: boolean) => void
  action: () => void
}
export function ModifyUsernameDialog({
  action,
  isModalOpen,
  setIsModalOpen,
  usernameFormController,
}: ModifyUsernameDialogProps) {
  return (
    <DialogComponent
      title={'Choose a new username'}
      triggerModalButton={<Button>Modify</Button>}
      content={
        <Controller
          name="username"
          rules={{
            required: 'Username is required',
            pattern: {
              value: /^[a-z]+$/,
              message:
                'Username should only contain lowercase letters of the alphabet',
            },
          }}
          control={usernameFormController.control}
          render={({ field, fieldState: { error } }) => (
            <InputText
              label="Username"
              type="text"
              name="username"
              className="w-full !rounded-lg min-h-[40px]"
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
            />
          )}
        />
      }
      actionButtonTitle="Confirm"
      action={action}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
    />
  )
}
