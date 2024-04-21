import { UserEntity } from '@beep/contracts'
import { Button, Icon } from '@beep/ui'
import { useState } from 'react'
import { ListMembers } from './list-members'

interface MembersNavigationProps {
  users: UserEntity[]
  onInviteMember?: () => void
}

export default function MembersNavigation({
  users,
  onInviteMember,
}: MembersNavigationProps) {
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
        <Button
          iconLeft="lucide:plus"
          className="!bg-violet-400 !min-w-0 px-2 xl:px-3 py-2 text-base rounded-xl hover:rounded-2xl transition-rounded font-semibold flex flex-row gap-2 justify-center items-center cursor-pointer"
          onClick={onInviteMember}
        >
          <h5>Invite</h5>
        </Button>
      </div>
      <div className="flex flex-col gap-1 overflow-y-scroll no-scrollbar scroll-smooth">
        <ListMembers users={users} />
      </div>
    </div>
  )
}
