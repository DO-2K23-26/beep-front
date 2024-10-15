import { UserConnectedEntity, UserDisplayedEntity } from '@beep/contracts'
import { getResponsiveState } from '@beep/responsive'
import { Icon, UseModalProps } from '@beep/ui'
import { useSelector } from 'react-redux'
import InviteMemberModalFeature from '../feature/invite-member-modal-feature'
import { ListMembers } from './list-members'
import { ListMemberSkeleton } from './list-member-skeleton'

interface MembersNavigationProps {
  usersConnected?: UserConnectedEntity[]
  users?: UserDisplayedEntity[]
  openModal: React.Dispatch<React.SetStateAction<UseModalProps | undefined>>
  isLoadingUsers: boolean
  isLoadingConnected: boolean
}

export default function MembersNavigation({
  usersConnected,
  users,
  openModal,
  isLoadingConnected,
  isLoadingUsers,
}: MembersNavigationProps) {
  const { showRightPane } = useSelector(getResponsiveState)

  return (
    <div
      className={`bg-violet-300 p-6 rounded-r-3xl flex flex-col gap-6 ${
        showRightPane ? 'w-full' : 'sm:w-fit'
      }`}
    >
      <div className="flex items-center justify-betwee space-x-6">
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
        {users !== undefined &&
        usersConnected !== undefined &&
        !isLoadingConnected &&
        !isLoadingUsers ? (
          <ListMembers usersConnected={usersConnected} users={users} />
        ) : (
          <ListMemberSkeleton />
        )}
      </div>
    </div>
  )
}
