import { cn } from '@beep/utils'
import { Icon } from '../icons/icon'
import { ButtonShadCn, ButtonShadCnProps } from './button-shadcn'
import { PropsWithChildren } from 'react'

export interface ButtonIconProps {
  icon?: string
  className?: string
  textClassName?: string
  title?: string
  buttonProps?: ButtonShadCnProps
  textHiddenResponsive?: boolean
  onClick?: () => void
  asChild?: boolean
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
  onClick,
}: PropsWithChildren<ButtonIconProps>) {
  return (
    <ButtonShadCn
      variant={buttonProps?.variant}
      size={buttonProps?.size}
      className={cn('bg-violet-300 gap-2', className)}
      onClick={onClick}
      asChild={asChild}
    >
      {children ? (
        children
      ) : (
        <>
          {icon && <Icon name={icon} className="w-4 h-4" />}
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
