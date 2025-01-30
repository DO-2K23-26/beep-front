import { MemberEntity, Permissions, UserConnectedEntity } from '@beep/contracts'
import { getResponsiveState } from '@beep/responsive'
import { Icon, UseModalProps } from '@beep/ui'
import { cn } from '@beep/utils'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import InviteMemberModalFeature from '../feature/invite-member-modal-feature'
import { ListMemberSkeleton } from './list-member-skeleton'
import { ListMembers } from './list-members'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ServerContext } from '@beep/pages/channels'

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
  const { showRightPane } = useSelector(getResponsiveState)
  const { myMember, server } = useContext(ServerContext)

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
      <div className="flex items-start justify-between space-x-6">
        <h5 className="text-slate-900 font-semibold pl-3">
          {t('layout.members-navigation.members')}
        </h5>
        {(!myMember ||
          myMember?.hasPermission(Permissions.CREATE_INVITATION)) && (
          <button
            className="p-2 bg-violet-400 rounded-lg hover:rounded-xl transition-all"
            onClick={() => {
              openModal({
                content: (
                  <InviteMemberModalFeature serverId={server?.id ?? ''} />
                ),
              })
            }}
          >
            <Icon name="lucide:plus" className="w-4 h-4" />
          </button>
        )}
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
