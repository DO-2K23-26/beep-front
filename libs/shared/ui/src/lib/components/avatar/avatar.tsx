import { classNames } from '@beep/utils'

export enum AvatarStyle {
  NORMAL = 'normal',
  STROKED = 'stroked'
}

export interface AvatarProps {
  username: string
  url?: string
  style?: AvatarStyle
  icon?: string
  logoUrl?: string
  logoText?: string
  className?: string
  alt?: string
  onClick?: () => void
  size?: number
  noTooltip?: boolean
  rounded?: string
}

export function Avatar(props: AvatarProps) {
  const {
    username,
    url,
    style,
    icon,
    logoUrl,
    logoText,
    className = '',
    alt,
    onClick,
    size = 32,
    noTooltip = false,
    rounded
  } = props


  const defineClass = `${style === AvatarStyle.STROKED ? 'border border-neutral-200' : ''} ${
    onClick ? 'cursor-pointer' : ''
  }`

  const avatarContent = (
    <div
      data-testid="avatar"
      style={{ width: size, height: size }}
      className={classNames('block rounded-full relative', defineClass, className)}
    >
      {url ?
        <img
          src={url} alt={alt}
          className={classNames(
            'w-full h-full',
            rounded || 'rounded-full'
          )}
        />
        : <div className={classNames(
          'w-full h-full rounded-full bg-neutral-200 text-center flex justify-center items-center',
          rounded || 'rounded-full'
        )}>
          <span className="text-xs text-neutral-400 font-medium relative">
            {username && username.charAt(0).toUpperCase()}
          </span>
        </div>

      }

    </div>
  )

  return <>{avatarContent}</>
}
