import { UserConnectedEntity, UserEntity } from '@beep/contracts'
import { Icon, UseModalProps } from '@beep/ui'
import { ListMembers } from './list-members'
import { useSelector } from 'react-redux'
import { getResponsiveState } from '@beep/responsive'
import InviteMemberModalFeature from '../feature/invite-member-modal-feature'

interface MembersNavigationProps {
  usersConnected: UserConnectedEntity[]
  users: UserEntity[]
  openModal: React.Dispatch<React.SetStateAction<UseModalProps | undefined>>
  closeModal: () => void
}

export default function MembersNavigation({
  usersConnected,
  users,
  openModal,
  closeModal,
}: MembersNavigationProps) {
  const { showRightPane } = useSelector(getResponsiveState)

  return (
    <div
      className={`bg-violet-300 p-6 rounded-r-3xl flex flex-col gap-6 ${
        showRightPane ? 'w-full' : 'sm:w-fit'
      }`}
    >
      <div className="flex items-center justify-between">
        <h5 className="text-slate-900 font-semibold pl-3">Members</h5>
        <button
          className="p-2 bg-violet-400 rounded-lg hover:rounded-xl transition-all"
          onClick={() => {
            openModal({
              content: <InviteMemberModalFeature />,
            })
          }}
        >
          <Icon name="lucide:plus" className="w-4 h-4" />
        </button>
      </div>
      {/* Members list */}
      <div className="flex flex-col gap-1 overflow-y-scroll no-scrollbar scroll-smooth">
        <ListMembers usersConnected={usersConnected} users={users} />
      </div>
    </div>
  )
}
