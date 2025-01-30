import { cn } from '@beep/utils'
import { Icon } from '../icons/icon'
import { ButtonShadCn, ButtonShadCnProps } from './button-shadcn'
import { PropsWithChildren } from 'react'
import { LoaderSpinner } from '../loader-spinner/loader-spinner'

export interface ButtonIconProps {
  icon?: string
  className?: string
  textClassName?: string
  title?: string
  buttonProps?: ButtonShadCnProps
  textHiddenResponsive?: boolean
  asChild?: boolean
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  iconClassName?: string
}
export function ButtonIcon({
  children,
  icon,
  className,
  textClassName,
  title,
  buttonProps,
  textHiddenResponsive,
  asChild,
  loading,
  iconClassName = 'size-4',
  disabled,
  type = 'button',
  onClick,
}: PropsWithChildren<ButtonIconProps>) {
  return (
    <ButtonShadCn
      type={type}
      variant={buttonProps?.variant}
      size={buttonProps?.size}
      disabled={disabled}
      className={cn('bg-violet-300 gap-2 ', className)}
      onClick={onClick}
      asChild={asChild}
    >
      {loading ? (
        <LoaderSpinner className="size-4 sm:size-5 md:size-6" />
      ) : children ? (
        children
      ) : (
        <>
          {icon && <Icon name={icon} className={iconClassName} />}
          {title && (
            <p
              className={cn('text-xs md:text-sm lg:text-base', textClassName, {
                'hidden md:block': textHiddenResponsive,
              })}
            >
              {title}
            </p>
          )}
        </>
      )}
    </ButtonShadCn>
  )
}
