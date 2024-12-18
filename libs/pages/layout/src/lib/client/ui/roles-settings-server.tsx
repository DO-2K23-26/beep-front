import { ServerEntity } from '@beep/contracts'
import { RootState } from '@beep/store'
import { useSelector } from 'react-redux'

export interface RolesSettingsServerProps {
  server: ServerEntity
}

export function RolesSettingsServer({ server }: RolesSettingsServerProps) {
  const roles = useSelector((state: RootState) => state.servers.roles)

  return (
    <div className="flex flex-col w-full bg-violet-200 p-4 overflow-y-auto gap-4">
      <p className="text-slate-700 font-bold text-base sm:text-xl md:text-3xl">
        Rôles
      </p>
      <p>Y'en a {roles.length}</p>
    </div>
  )
}
