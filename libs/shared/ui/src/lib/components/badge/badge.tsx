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
}

export function Badge({ type, title, className }: BadgeProps) {
  return (
    <div
      className={`${type} ${className} text-xs leading-none font-semibold rounded-full md:py-[6px] p-2 md:px-2 w-min`}
    >
      <div className="hidden md:block truncate">{title}</div>
    </div>
  )
}
