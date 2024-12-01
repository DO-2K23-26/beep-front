import { cn } from '@beep/utils'
import { ButtonShadCn } from '@beep/ui'
import { PropsWithChildren } from 'react'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ButtonNavigationHeaderProps {
  path: string
}

export function ButtonNavigationHeader({
  children,
  path,
}: PropsWithChildren<ButtonNavigationHeaderProps>) {
  const { pathname } = useLocation()

  return (
    <ButtonShadCn
      variant={'ghost'}
      size={'responsiveDefault'}
      className={cn('hover:bg-violet-100 text-base md:text-xl', {
        'bg-violet-500': pathname === path,
      })}
    >
      <Link to={path}>{children}</Link>
    </ButtonShadCn>
  )
}
