export enum BadgeType {
  SUCCESS = 'bg-green-500',
  DANGER = 'bg-red-500',
  WARNING = 'bg-yellow-500',
  INFO = 'bg-blue-500',
  DEFAULT = 'bg-gray-500',
  ONLINE = 'bg-green-300',
  OFFLINE = 'bg-red-300',
}

export interface BadgeProps {
  type: BadgeType
  title: string
  className?: string
  onClick?: () => void
}

export function Badge({ type, title, className, onClick }: BadgeProps) {
  return (
    <div
      className={`${type} ${className} lg:h-fit text-xs leading-none font-semibold text-white rounded-full lg:py-[6px] lg:px-2 truncate p-[0.40rem] w-2 h-2 lg:w-min`}
      onClick={onClick}
    >
      <div className="hidden lg:block truncate">{title}</div>
    </div>
  )
}
