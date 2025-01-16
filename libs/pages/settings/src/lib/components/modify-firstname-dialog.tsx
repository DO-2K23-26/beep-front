import { Button, DialogComponent, InputText } from '@beep/ui'
import { Controller, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  return (
    <DialogComponent
      title={t('settings.components.modify-firstname-dialog.title')}
      triggerModalButton={
        <div>
          <Button>
            {t('settings.components.modify-firstname-dialog.modify')}
          </Button>
        </div>
      }
      content={
        <Controller
          name="firstName"
          rules={{
            required: t(
              'settings.components.modify-firstname-dialog.content_required'
            ),
            pattern: {
              value:
                /^[A-Za-zÀ-ÿ][A-Za-zà-ÿ]*(?:[ '-][A-Za-zà-ÿ][A-Za-zà-ÿ]*)?$/,
              message: t(
                'settings.components.modify-firstname-dialog.content_message'
              ),
            },
          }}
          control={firstnameFormController.control}
          render={({ field, fieldState: { error } }) => (
            <InputText
              label={t(
                'settings.components.modify-firstname-dialog.render_label'
              )}
              type="text"
              name="firstName"
              className="w-full !rounded-lg min-h-[40px]"
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
            />
          )}
        />
      }
      actionButtonTitle={t(
        'settings.components.modify-firstname-dialog.confirm'
      )}
      action={action}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
    />
  )
}
