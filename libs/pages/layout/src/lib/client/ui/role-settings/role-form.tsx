import { serverRoles } from '@beep/contracts'
import { Button, ButtonStyle, InputText } from '@beep/ui'
import { Controller, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export interface RoleFormProps {
  formType: 'create' | 'update'
  loading: boolean
  closeModal: () => void
  onSubmitForm: () => void
  methodsRoleForm: UseFormReturn<{
    roleId: string | null
    name: string
    permissions: string[]
  }>
}

export function RoleForm({
  formType,
  loading,
  closeModal,
  onSubmitForm,
  methodsRoleForm,
}: RoleFormProps) {
  const { t, i18n } = useTranslation()

  return (
    <div className="p-6">
      <h3 className="text-slate-700 font-bold mb-2 max-w-sm">
        {formType === 'create'
          ? t('layout.role-form.create_title')
          : t('layout.role-form.update_title')}
      </h3>
      <p className="text-slate-500 text-sm mb-4">
        {t('layout.role-form.choose_role_name')}
      </p>
      <Controller
        name="name"
        rules={{
          required: t('layout.role-form.role_name_is_required'),
          minLength: {
            value: 1,
            message: t('layout.role-form.role_name_is_required'),
          },
        }}
        control={methodsRoleForm.control}
        render={({ field, fieldState: { error } }) => (
          <InputText
            className="w-full !rounded-lg min-h-[40px] mb-4"
            label={t('layout.role-form.role_name')}
            name="name"
            type="text"
            onChange={field.onChange}
            value={field.value}
            error={error?.message}
          />
        )}
      />
      <div className="mb-4 flex flex-col gap-2">
        {serverRoles.map((role, index) => (
          <div
            key={index}
            className="flex flex-row items-center gap-3 px-2 py-[6px] rounded-md cursor-pointer hover:bg-black/10"
          >
            <input
              id={role.name[i18n.language]}
              type="checkbox"
              value={role.value}
              {...methodsRoleForm.register('permissions')}
            />
            <label
              htmlFor={role.name[i18n.language]}
              className="cursor-pointer"
            >
              <p className="font-semibold">{role.name[i18n.language]}</p>
              <p className="text-slate-500 text-sm">
                {role.description[i18n.language]}
              </p>
            </label>
          </div>
        ))}
      </div>
      <div className="flex gap-3 justify-between">
        <Button
          className="btn--no-min-w"
          style={ButtonStyle.STROKED}
          onClick={() => closeModal()}
        >
          {t('layout.role-form.cancel')}
        </Button>
        <Button
          className="btn--no-min-w"
          loading={loading}
          style={ButtonStyle.BASIC}
          onClick={() => onSubmitForm()}
        >
          {formType === 'create'
            ? t('layout.role-form.create')
            : t('layout.role-form.update')}
        </Button>
      </div>
    </div>
  )
}
