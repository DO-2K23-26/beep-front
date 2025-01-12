import { Button, InputPicture, InputSelect, InputText } from '@beep/ui' // Composants UI personnalisés
import { BaseSyntheticEvent } from 'react'
import { Control, Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { CreateWebhookForm } from '../feature/new-webhook-modal-feature'

interface CreateWebhookModalProps {
  control: Control<CreateWebhookForm>
  onSubmit: (e: BaseSyntheticEvent) => Promise<void>
  loading: boolean
  closeModal: () => void
}

export default function CreateWebhookModal({
  onSubmit,
  loading,
  control,
  closeModal,
}: CreateWebhookModalProps): JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="p-7 flex flex-col gap-3">
      <h3 className="font-bold ">
        {' '}
        {t('layout.new-webhook-modal.create_modal.title')}
      </h3>
      <p>{t('layout.new-webhook-modal.create_modal.subtitle')}</p>
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <span className="flex items-center justify-center">
          <Controller
            name="profilePicture"
            control={control}
            render={({ field }) => (
              <InputPicture
                value={field.value}
                onChange={(e) => field.onChange(e.target.files[0])}
                label={t('layout.add-server.create-server-modal.add_picture')}
              />
            )}
          />
        </span>
        <Controller
          name="webhookName"
          rules={{
            required: t('layout.new-webhook-modal.create_modal.name_required'),
            minLength: {
              value: 1,
              message: t('layout.new-webhook-modal.create_modal.name_required'),
            },
          }}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <InputText
              label={t('layout.new-webhook-modal.create_modal.name_label')}
              type="text"
              name="webhookName"
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
            />
          )}
        />
        <Controller
          name="channelId"
          control={control}
          rules={{
            required: t(
              'layout.new-webhook-modal.create_modal.channel_required'
            ),
          }}
          render={({ field, fieldState: { error } }) => (
            <InputSelect
              label={t('layout.new-webhook-modal.create_modal.channel_label')}
              options={[
                { value: '#General', label: '#General' },
                { value: '#Updates', label: '#Updates' },
                { value: '#Announcements', label: '#Announcements' },
              ]}
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
            />
          )}
        />
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col w-1/4">
            <Button
              loading={loading}
              onClick={closeModal}
              className="!bg-violet-50 group hover:!bg-slate-900 w-full !rounded-lg min-h-[40px] !border-slate-300 hover:!border-slate-900 border-2"
            >
              <p className="text-slate-900 group-hover:text-violet-50">
                {t('layout.new-webhook-modal.create_modal.cancel')}
              </p>
            </Button>
            <div className="flex flex-col w-1/4">
              <Button
                type="submit"
                loading={loading}
                className="!bg-slate-800 hover:!bg-slate-900 w-full !rounded-lg min-h-[40px]"
              >
                <p className="text-violet-50">
                  {t('layout.new-webhook-modal.create_modal.create')}
                </p>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
