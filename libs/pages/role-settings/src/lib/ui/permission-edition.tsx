import { Permissions } from '@beep/contracts'
import { Alert, AlertTitle, InputText } from '@beep/ui'
import { cn } from '@beep/utils'
import { ReactNode, useContext, useMemo } from 'react'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { EditRoleContext } from '../feature/edit-role-provider'
import { RoleCardSwitch } from './role-card-switch'

export function PermissionEdition() {
  const { t } = useTranslation()
  const { roleFormControl, onCheckRole, editRoleForm, isFormTouched } =
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
          permission={permission}
          isChecked={permissions?.includes(permission)}
          onClick={onCheckRole}
        />
      )
    }
    return elements
  }, [permissions, onCheckRole])
  return (
    <div className="flex flex-col h-full w-full">
      <Alert
        className={cn(
          'fixed bottom-5 left-1/4 right-1/4  bg-violet-900 w-1/2 z-50',
          { hidden: !isFormTouched }
        )}
      >
        <AlertTitle className="text-white">Heads up!</AlertTitle>
      </Alert>

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
          render={({ field, fieldState: { error } }) => {
            return (
              <InputText
                className="w-full sticky top-0 !rounded-lg !z-50"
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
      <div className="flex h-full w-full">
        <div className="flex flex-col gap-2 snap-y w-full ">
          {permissionsCheckboxElement}
        </div>
      </div>
    </div>
  )
}
