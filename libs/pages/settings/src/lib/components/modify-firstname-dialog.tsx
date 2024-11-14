import { Button, DialogComponent, InputText } from '@beep/ui'
import { Controller, UseFormReturn } from 'react-hook-form'

interface ModifyFirstnameDialogProps {
  firstnameFormController: UseFormReturn<{ firstName: string }, any, undefined>
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
          name="firstName"
          rules={{
            required: 'First name is required',
            pattern: {
              value: /^[A-ZÀ-Ý][a-zà-ÿ]*(?:[ '-][A-ZÀ-Ý][a-zà-ÿ]*)?$/,
              message:
                'Last name should start with an uppercase letter, contain only letters, and allow one hyphen, space, or apostrophe between two parts of the name',
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
