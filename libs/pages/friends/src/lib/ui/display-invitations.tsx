import { InvitationEntity } from '@beep/contracts'
import { FriendsInvitationRowFeature } from '../feature/friends-invitation-row-feature'
import { LoadingFriendsList } from './loading-friends-list'
import { EmptyInvitationList } from './empty-invitations-list'

interface DisplayInvitationsProps {
  invitations?: InvitationEntity[]
  loading?: boolean
}

export function DisplayInvitations({
  invitations,
  loading,
}: DisplayInvitationsProps) {
  if (invitations === undefined || invitations.length === 0)
    return (
        <EmptyInvitationList />
    )
  if (loading) return <LoadingFriendsList />
  return (
    <>
      {invitations.map((invitation) => (
        <FriendsInvitationRowFeature invitation={invitation} />
      ))}
    </>
  )
}
