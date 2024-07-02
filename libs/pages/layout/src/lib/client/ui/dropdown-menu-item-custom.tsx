import { Icon } from "@beep/ui"

interface DropdownMenuItemCustomProps {
    onClick?: () => void
    label: string
    iconName?: string
    className?: string
    warning?: boolean
  }
  export function DropdownMenuItemCustom({
    onClick,
    label,
    iconName,
    className,
    warning,
  }: DropdownMenuItemCustomProps) {
    const colors = {
      default: 'text-tint-900 hover:bg-violet-100 hover:text-tint-900',
      warning: 'text-red-600 fill-red-600 hover:bg-red-100 hover:text-red-600',
    }
    const focusedColor = warning ? colors.warning : colors.default
    return (
      <button
        className={`flex items-center gap-2 pl-2 py-1 pr-9 ${className} ${focusedColor} rounded-md  transition-colors cursor-pointer`}
        onClick={onClick}
      >
        {iconName && <Icon className={`${focusedColor}`} name={iconName} />}
        <p className={`font-bold ${focusedColor}`}>{label}</p>
      </button>
    )
  }