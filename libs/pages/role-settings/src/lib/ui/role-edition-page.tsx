import { Permissions } from '@beep/contracts'
import { InputText } from '@beep/ui'
import { ReactNode, useContext, useMemo } from 'react'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { EditRoleContext } from '../feature/edit-role-provider'
import { RoleCardSwitch } from './role-card-switch'

export function RoleEditionPage() {
  const { t } = useTranslation()
  const { role, roleFormControl, onCheckRole, editRoleForm } =
    useContext(EditRoleContext)
  const permissions = editRoleForm?.watch('permissions')
  const permissionsCheckboxElement = useMemo(() => {
    const elements: ReactNode[] = []
    for (const permission of Object.values(Permissions).filter(
      (value) => typeof value === 'number'
    )) {
      elements.push(
        <RoleCardSwitch
          key={permission}
          permission={permission as Permissions}
          isChecked={permissions?.includes(permission) ?? false}
          onClick={onCheckRole}
        />
      )
    }
    return elements
  }, [permissions, onCheckRole])

  return (
    <div className="flex flex-col gap-4 px-2">
      <div className="text-lg sm:text-xl md:text-2xl">{role?.name}</div>
      <Controller
        name="name"
        control={roleFormControl}
        rules={{
          required: t('layout.role-form.role_name_is_required'),
          minLength: {
            value: 1,
            message: t('layout.role-form.role_name_is_required'),
          },
        }}
        render={({ field, fieldState: { error }, formState }) => {
          return (
            <InputText
              className="w-full !rounded-lg min-h-[40px] mb-4"
              label={t('layout.role-form.role_name')}
              name="name"
              type="text"
              onChange={field.onChange}
              value={field.value}
              error={error?.message}
            />
          )
        }}
      />
      <div className="mb-4 flex flex-col gap-2">
        {permissionsCheckboxElement}
      </div>
    </div>
  )
}
