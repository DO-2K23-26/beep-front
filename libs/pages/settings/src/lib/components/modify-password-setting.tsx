import { Button, DialogComponent, InputText } from '@beep/ui';
import { Controller, UseFormReturn } from 'react-hook-form';

interface ModifyPasswordDialogProps {
  passwordFormController: UseFormReturn<{ currentPassword: string; verifyNewPassword: string; newPassword: string }, undefined>;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  action: () => void;
}

export function ModifyPasswordDialog({
  action,
  isModalOpen,
  setIsModalOpen,
  passwordFormController,
}: ModifyPasswordDialogProps) {
  return (
    <DialogComponent
      title={'Update Password'}
      triggerModalButton={<Button className='w-min whitespace-nowrap'>Modify Password</Button>}
      content={
        <>
          <Controller
            name="currentPassword"
            rules={{ required: 'Enter your current password' }}
            control={passwordFormController.control}
            render={({ field, fieldState: { error } }) => (
              <InputText
                label="Current Password"
                type="password"
                name="currentPassword"
                className="w-full !rounded-lg min-h-[40px]"
                value={field.value}
                onChange={field.onChange}
                error={error?.message}
              />
            )}
          />
          <Controller
            name="newPassword"
            rules={{
              required: 'Password is required',
              pattern: {
                value:
                  /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!?@#$%^&*[|/\]{}()])(?=.{8,})/,
                message:
                  'Password must be at least 8 characters long and contain at least one uppercase letter, one digit, and one special character',
              },
            }}
            control={passwordFormController.control}
            render={({ field, fieldState: { error } }) => (
              <InputText
                label="New Password"
                type="password"
                name="newPassword"
                className="w-full !rounded-lg min-h-[40px]"
                value={field.value}
                onChange={field.onChange}
                error={error?.message}
              />
            )}
          />
          <Controller
            name="verifyNewPassword"
            rules={{
              required: 'Verify your new password',
              validate: (value) =>
                value === passwordFormController.getValues('newPassword') || 'Passwords do not match',
            }}
            control={passwordFormController.control}
            render={({ field, fieldState: { error } }) => (
              <InputText
                label="Verify New Password"
                type="password"
                name="verifyNewPassword"
                className="w-full !rounded-lg min-h-[40px]"
                value={field.value}
                onChange={field.onChange}
                error={error?.message}
              />
            )}
          />
        </>
      }
      actionButtonTitle="Confirm"
      action={action}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
    />
  );
}
