import { Button, DialogComponent, InputText } from '@beep/ui'
import { Controller, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
interface ModifyUsernameDialogProps {
  usernameFormController: UseFormReturn<{ username: string }, any, undefined>
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
  const { t } = useTranslation()

  return (
    <DialogComponent
      title={t('settings.components.modify-username-dialog.title')}
      triggerModalButton={
        <div>
          <Button>
            {t('settings.components.modify-username-dialog.modify')}
          </Button>
        </div>
      }
      content={
        <Controller
          name="username"
          rules={{
            required: t(
              'settings.components.modify-username-dialog.required_username'
            ),
            pattern: {
              value: /^[a-z]+$/,
              message: t(
                'settings.components.modify-username-dialog.invalid_username'
              ),
            },
          }}
          control={usernameFormController.control}
          render={({ field, fieldState: { error } }) => (
            <InputText
              label={t('settings.components.modify-username-dialog.username')}
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
      actionButtonTitle={t(
        'settings.components.modify-username-dialog.confirm'
      )}
      action={action}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
    />
  )
}
