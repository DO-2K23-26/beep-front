import { Button, DialogComponent, InputText } from '@beep/ui'
import { Controller, UseFormReturn } from 'react-hook-form'

interface ModifyLastnameDialogProps {
  lastnameFormController: UseFormReturn<{ lastName: string }, any, undefined>
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
          name="lastName"
          rules={{
            required: 'Last name is required',
            pattern: {
              value: /^[A-ZÀ-Ý][a-zà-ÿ]*(?:[ '-][A-ZÀ-Ý][a-zà-ÿ]*)?$/,
              message:
                'Last name should start with an uppercase letter, contain only letters, and allow one hyphen, space, or apostrophe between two parts of the name',
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
