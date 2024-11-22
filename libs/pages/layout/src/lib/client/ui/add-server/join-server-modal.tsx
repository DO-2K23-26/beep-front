import { Button, InputText } from '@beep/ui'
import { BaseSyntheticEvent } from 'react'
import { Control, Controller } from 'react-hook-form'
import { AddServerForm } from '../../feature/add-server-feature'
import { useTranslation } from 'react-i18next'

interface JoinServerModalProps {
  onSubmit: (e: BaseSyntheticEvent) => Promise<void>
  control: Control<AddServerForm>
  loading: boolean
  closeModal: () => void
}

export function JoinServerModal({
  onSubmit,
  control,
  loading,
  closeModal,
}: JoinServerModalProps) {
  const { t } = useTranslation()

  return (
    <div className="p-7 flex flex-col gap-3">
      <h3 className="font-bold">
        {t('layout.add-server.join-server-modal.join_server')}
      </h3>
      <p>{t('layout.add-server.join-server-modal.enter_server_id')}</p>
      <form onSubmit={onSubmit}>
        <Controller
          name="serverId"
          rules={{
            required: t('layout.add-server.join-server-modal.enter_server'),
          }}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <InputText
              className="w-full !rounded-lg min-h-[40px] mb-4"
              label={'Server ID'}
              name="serverId"
              type="text"
              onChange={field.onChange}
              value={field.value}
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
                {t('layout.add-server.join-server-modal.cancel')}
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
                {t('layout.add-server.join-server-modal.join')}
              </p>
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
