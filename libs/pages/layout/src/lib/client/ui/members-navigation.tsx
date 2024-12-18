import { MemberEntity, UserConnectedEntity } from '@beep/contracts'
import { getResponsiveState } from '@beep/responsive'
import { Icon, UseModalProps } from '@beep/ui'
import { useSelector } from 'react-redux'
import InviteMemberModalFeature from '../feature/invite-member-modal-feature'
import { ListMemberSkeleton } from './list-member-skeleton'
import { ListMembers } from './list-members'
import { useTranslation } from 'react-i18next'
import { cn } from '@beep/utils'
import { useParams } from 'react-router'

interface MembersNavigationProps {
  usersConnected?: UserConnectedEntity[]
  members?: MemberEntity[]
  openModal: React.Dispatch<React.SetStateAction<UseModalProps | undefined>>
  isLoadingUsers: boolean
  isLoadingConnected: boolean
}

export default function MembersNavigation({
  usersConnected,
  members,
  openModal,
  isLoadingConnected,
  isLoadingUsers,
}: MembersNavigationProps) {
  const { t } = useTranslation()
  const { serverId } = useParams<{ serverId: string }>()
  const { showRightPane } = useSelector(getResponsiveState)

  return (
    <div
      className={cn(
        'bg-violet-300 p-6 rounded-r-3xl flex flex-col sm:hidden transition-all gap-4',
        {
          'w-fit hidden sm:flex': showRightPane,
          'sm:w-fit hidden xl:flex': !showRightPane,
        }
      )}
    >
      <div className="flex items-center justify-between space-x-6">
        <h5 className="text-slate-900 font-semibold pl-3">
          {t('layout.members-navigation.members')}
        </h5>
        <button
          className="p-2 bg-violet-400 rounded-lg hover:rounded-xl transition-all"
          onClick={() => {
            openModal({
              content: <InviteMemberModalFeature serverId={serverId} />,
            })
          }}
        >
          <Icon name="lucide:plus" className="w-4 h-4" />
        </button>
      </div>
      {/* Members list */}
      <div className="flex flex-col gap-1 overflow-y-scroll no-scrollbar scroll-smooth">
        {members !== undefined &&
        usersConnected !== undefined &&
        !isLoadingConnected &&
        !isLoadingUsers ? (
          <ListMembers usersConnected={usersConnected} members={members} />
        ) : (
          <ListMemberSkeleton />
        )}
      </div>
    </div>
  )
}
