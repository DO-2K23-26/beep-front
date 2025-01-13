import { Button, DialogComponent, InputText } from '@beep/ui'
import { Controller, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  return (
    <DialogComponent
      title={t('settings.components.modify-lastname-dialog.title')}
      triggerModalButton={
        <div>
          <Button>
            {t('settings.components.modify-lastname-dialog.modify')}
          </Button>
        </div>
      }
      content={
        <Controller
          name="lastName"
          rules={{
            required: t(
              'settings.components.modify-lastname-dialog.content_required'
            ),
            pattern: {
              value: /^[A-ZÀ-Ý][a-zà-ÿ]*(?:[ '-][A-ZÀ-Ý][a-zà-ÿ]*)?$/,
              message: t(
                'settings.components.modify-lastname-dialog.content_message'
              ),
            },
          }}
          control={lastnameFormController.control}
          render={({ field, fieldState: { error } }) => (
            <InputText
              label={t(
                'settings.components.modify-lastname-dialog.render_label'
              )}
              type="text"
              name="lastName"
              className="w-full !rounded-lg min-h-[40px]"
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
            />
          )}
        />
      }
      actionButtonTitle={t(
        'settings.components.modify-lastname-dialog.confirm'
      )}
      action={action}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
    />
  )
}
