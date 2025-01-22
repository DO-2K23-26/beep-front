import { Permissions } from '@beep/contracts'
import { cn } from '@beep/utils'
import { Switch } from '@beep/ui'
import { useTranslation } from 'react-i18next'

interface RoleCheckboxProps {
  permission: Permissions
  onClick?: (permission: Permissions, isChecked?: boolean) => void
  isChecked?: boolean
}

export function RoleCardSwitch({
  permission,
  onClick,
  isChecked,
}: RoleCheckboxProps) {
  const { t } = useTranslation()
  const permissionSringified = Permissions[permission]

  return (
    <div
      onClick={() => onClick && onClick(permission, isChecked)}
      key={permissionSringified}
      className="flex flex-row justify-between items-center w-full gap-3 px-2 py-1 rounded-md cursor-pointer hover:bg-black/10 snap-end"
    >
      <div>
        <p className="text-slate-950 sm:text-sm md:text-lg">
          {t(`permissions.${permissionSringified}.name`)}
        </p>
        <p className="text-slate-700 hidden sm:flex sm:text-xs md:text-sm">
          {t(`permissions.${permissionSringified}.description`)}
        </p>
      </div>
      <Switch
        className={cn({ 'bg-violet-600': isChecked })}
        checked={isChecked}
      />
    </div>
  )
}
