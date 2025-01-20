import { RoleEntity } from '@beep/contracts'
import { cn } from '@beep/utils'
import { PropsWithChildren } from 'react'

export interface RoleServerProps {
  role: RoleEntity
  onClick?: () => void
}

export function RoleServer({
  children,
  role,
  onClick,
}: PropsWithChildren<RoleServerProps>) {
  return (
    <div
      className={cn('flex justify-between items-center', {
        'cursor-pointer hover:bg-black/10': !!onClick,
      })}
    >
      <p className="text-xs sm:text-sm md:text-base">{role.name}</p>
      {children}
    </div>
  )
}
