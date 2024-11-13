import { Button, DialogComponent, InputText } from '@beep/ui'
import { Controller, UseFormReturn } from 'react-hook-form'

interface ModifyLastnameDialogProps {
  lastnameFormController: UseFormReturn<{ lastname: string }, any, undefined>
  isModalOpen: boolean
  setIsModalOpen: (value: boolean) => void
  action: () => void
}
export function ModifyLastnameDialog({
  action,
  isModalOpen,
  setIsModalOpen,
  lastnameFormController,
}: ModifyLastnameDialogProps) {
  return (
    <DialogComponent
      title={'Choose a new Last name'}
      triggerModalButton={
        <div>
          <Button>Modify</Button>
        </div>
      }
      content={
        <Controller
          name="lastname"
          rules={{
            required: 'Last name is required',
            pattern: {
              value: /^[a-zA-ZÀ-ÿ]+$/,
              message:
                'Last name should only contain letters of the alphabet (uppercase or lowercase)',
            },
          }}
          control={lastnameFormController.control}
          render={({ field, fieldState: { error } }) => (
            <InputText
              label="Lastname"
              type="text"
              name="lastname"
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
