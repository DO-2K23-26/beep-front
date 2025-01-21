import { Button, DialogComponent, InputText } from '@beep/ui'
import { Controller, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  return (
    <DialogComponent
      title={t('settings.components.modify-password-setting.title')}
      triggerModalButton={
        <Button className="w-min whitespace-nowrap">
          {t('settings.components.modify-password-setting.modify')}
        </Button>
      }
      content={
        <>
          <Controller
            name="currentPassword"
            rules={{
              required: t(
                'settings.components.modify-password-setting.current_password_rule'
              ),
            }}
            control={passwordFormController.control}
            render={({ field, fieldState: { error } }) => (
              <InputText
                label={t(
                  'settings.components.modify-password-setting.current_password_label'
                )}
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
              required: t(
                'settings.components.modify-password-setting.new_password_rule'
              ),
              pattern: {
                value:
                  /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!?@#$%^&*[|/\]{}()])(?=.{8,})/,
                message: t(''),
              },
            }}
            control={passwordFormController.control}
            render={({ field, fieldState: { error } }) => (
              <InputText
                label={t(
                  'settings.components.modify-password-setting.new_password_label'
                )}
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
              required: t(
                'settings.components.modify-password-setting.verify_password_rule'
              ),
              validate: (value) =>
                value === passwordFormController.getValues('newPassword') ||
                t(
                  'settings.components.modify-password-setting.verify_password_validate'
                ),
            }}
            control={passwordFormController.control}
            render={({ field, fieldState: { error } }) => (
              <InputText
                label={t(
                  'settings.components.modify-password-setting.verify_password_label'
                )}
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
      actionButtonTitle={t(
        'settings.components.modify-password-setting.action_button'
      )}
      action={action}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
    />
  )
}
