import { Button, DialogComponent, InputText } from '@beep/ui'
import { Controller, UseFormReturn } from 'react-hook-form'

interface ModifyFirstnameDialogProps {
  firstnameFormController: UseFormReturn<{ firstname: string }, any, undefined>
  isModalOpen: boolean
  setIsModalOpen: (value: boolean) => void
  action: () => void
}
export function ModifyFirstnameDialog({
  action,
  isModalOpen,
  setIsModalOpen,
  firstnameFormController,
}: ModifyFirstnameDialogProps) {
  return (
    <DialogComponent
      title={'Choose a new First name'}
      triggerModalButton={
        <div>
          <Button>Modify</Button>
        </div>
      }
      content={
        <Controller
          name="firstname"
          rules={{
            required: 'First name is required',
            pattern: {
              value: /^[a-zA-ZÀ-ÿ]+$/,
              message:
                'First name should only contain letters of the alphabet (uppercase or lowercase)',
            },
          }}
          control={firstnameFormController.control}
          render={({ field, fieldState: { error } }) => (
            <InputText
              label="First name"
              type="text"
              name="firstname"
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
