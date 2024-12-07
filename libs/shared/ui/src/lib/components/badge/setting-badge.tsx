type BadgeColor = 'SUCCESS' | 'DANGER' | 'WARNING'

const settingBadgeColor: Record<
  BadgeColor,
  {
    text: string
    bg: string
    border: string
  }
> = {
  SUCCESS: {
    text: 'text-green-500',
    bg: 'bg-green-500',
    border: 'border-green-500',
  },
  DANGER: {
    text: 'text-red-500',
    bg: 'bg-red-500',
    border: 'border-red-500',
  },
  WARNING: {
    text: 'text-yellow-500',
    bg: 'bg-yellow-500',
    border: 'border-yellow-500',
  },
}

export interface SettingBadgeProps {
  color: BadgeColor
  label: string
}

export function SettingBadge({ color, label }: SettingBadgeProps) {
  return (
    <div
      className={`${settingBadgeColor[color].border} border-2 px-2 gap-1 rounded-full flex flex-row justify-center items-center w-fit h-fit`}
    >
      <div
        className={`${settingBadgeColor[color].bg} w-2 h-2 rounded-full my-2`}
      ></div>
      <p className={`${settingBadgeColor[color].text} hidden sm:flex`}>
        {label}
      </p>
    </div>
  )
}
