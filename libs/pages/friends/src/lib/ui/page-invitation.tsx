import { InvitationEntity } from '@beep/contracts'
import { AddFriendInputFeature } from '../feature/add-friend-input-feature'
import { DisplayInvitations } from './display-invitations'

interface PageInvitationProps {
  invitations?: InvitationEntity[]
  isLoadingInvitations?: boolean
}

export function PageInvitation({
  invitations,
  isLoadingInvitations,
}: PageInvitationProps) {
  return (
    <div className=" flex flex-col w-full h-full p-2 sm:p-4 md:p-6 overflow-y-auto">
      <AddFriendInputFeature />
      <div className="flex flex-col w-full h-full overflow-y-scroll scroll-smooth no-scrollbar">
        <DisplayInvitations
          invitations={invitations}
          loading={isLoadingInvitations}
        />
      </div>
    </div>
  )
}
