import { Button, InputPicture, InputText, InputTextArea } from '@beep/ui'
import { BaseSyntheticEvent } from 'react'
import { Control, Controller } from 'react-hook-form'
import { AddServerForm } from '../../feature/add-server-feature'
import { useTranslation } from 'react-i18next'

interface CreateServerModalProps {
  control: Control<AddServerForm>
  onSubmit: (e: BaseSyntheticEvent) => Promise<void>
  loading: boolean
  closeModal: () => void
  visibility: 'private' | 'public'
}

export default function CreateServerModal({
  onSubmit,
  control,
  loading,
  closeModal,
  visibility,
}: CreateServerModalProps): JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="p-7 flex flex-col gap-3">
      <h3 className="font-bold">
        {' '}
        {t('layout.add-server.create-server-modal.build_server', {
          visibility: t(
            `layout.add-server.select-visibility-modal.${visibility}`
          ),
        })}
      </h3>
      <p>{t('layout.add-server.create-server-modal.server_title')}</p>
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <span className="flex items-center justify-center">
          <Controller
            name="icon"
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
          name="serverName"
          rules={{
            required: t('layout.add-server.create-server-modal.required_name'),
            minLength: {
              value: 1,
              message: t('layout.add-server.create-server-modal.required_name'),
            },
          }}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <InputText
              label={t('layout.add-server.create-server-modal.server_name')}
              type="text"
              name="serverName"
              className="w-full !rounded-lg min-h-[40px]"
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
            />
          )}
        ></Controller>
        <Controller
          name="description"
          rules={{
            required: t(
              'layout.add-server.create-server-modal.required_description'
            ),
            minLength: {
              value: 1,
              message: t(
                'layout.add-server.create-server-modal.required_description'
              ),
            },
          }}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <InputTextArea
              label={t(
                'layout.add-server.create-server-modal.server_description'
              )}
              name="description"
              className="w-full !rounded-lg min-h-[40px]"
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
            />
          )}
        ></Controller>

        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col w-1/4">
            <Button
              loading={loading}
              onClick={closeModal}
              className="!bg-violet-50 group hover:!bg-slate-900 w-full !rounded-lg min-h-[40px] !border-slate-300 hover:!border-slate-900 border-2"
            >
              <p className="text-slate-900 group-hover:text-violet-50">
                {t('layout.add-server.create-server-modal.cancel')}
              </p>
            </Button>
          </div>

          <div className="flex flex-col w-1/4">
            <Button
              type="submit"
              loading={loading}
              className="!bg-slate-800 hover:!bg-slate-900 w-full !rounded-lg min-h-[40px]"
            >
              <p className="text-violet-50">
                {t('layout.add-server.create-server-modal.create')}
              </p>
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
