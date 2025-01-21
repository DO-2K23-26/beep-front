import { RoleEntity } from '@beep/contracts'
import { cn } from '@beep/utils'
import { PropsWithChildren } from 'react'

export interface RoleServerProps {
  role: RoleEntity
  onClick?: () => void
  highlight?: boolean
}

export function RoleServer({
  children,
  role,
  onClick,
  highlight,
}: PropsWithChildren<RoleServerProps>) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex justify-between items-center',
        {
          'cursor-pointer p-1  hover:bg-violet-400/50 rounded-md': !!onClick,
        },
        { 'bg-violet-400': highlight }
      )}
    >
      <p className={cn('text-xs sm:text-sm md:text-base text-center')}>
        {role.name}
      </p>
      {children}
    </div>
  )
}
