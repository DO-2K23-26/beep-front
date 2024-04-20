import { UserEntity } from '@beep/contracts'
import { Icon } from '@beep/ui'
import { useState } from 'react'
import { ListMembers } from './list-members'

interface MembersNavigationProps {
  users: UserEntity[]
}

export default function MembersNavigation({ users }: MembersNavigationProps) {
  const [isRightDivVisible] = useState(false)

  return (
    <div
      className={`bg-violet-300 p-6 rounded-r-3xl flex flex-col gap-6 ${
        isRightDivVisible ? 'w-full' : 'sm:w-fit'
      }`}
    >
      <div className="flex flex-row justify-between items-center gap-10">
        <div className="flex flex-row gap-2 items-center">
          <Icon name="lucide:chevron-down" />
          <h5 className="text-slate-900 font-semibold">Members</h5>
        </div>
        <div className="bg-violet-400 px-2 xl:px-3 py-2 text-base rounded-xl hover:rounded-2xl transition-rounded font-semibold flex flex-row gap-2 justify-center items-center cursor-pointer">
          <Icon name="lucide:plus" />
          <h5 className="hidden xl:block">Invite</h5>
        </div>
      </div>
      <div className="flex flex-col gap-1 overflow-y-scroll no-scrollbar scroll-smooth">
        <ListMembers users={users} />
      </div>
    </div>
  )
}
