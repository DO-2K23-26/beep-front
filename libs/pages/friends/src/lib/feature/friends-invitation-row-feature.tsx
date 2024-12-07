import { InvitationEntity, UserDisplayedEntity } from '@beep/contracts'
import { getUserState } from '@beep/user'
import { useSelector } from 'react-redux'
import { FriendRow } from '../ui/friend-row'
import { InvitationAnswerButtonsFeature } from './invitation-answer-buttons-feature'

interface FriendsInvitationRowFeatureProps {
  invitation: InvitationEntity
}

export function FriendsInvitationRowFeature({
  invitation,
}: FriendsInvitationRowFeatureProps) {
  const { payload } = useSelector(getUserState)
  const currentUserId = payload?.sub

  // Select the user to display
  // We will the user that is not the current user
  const user: UserDisplayedEntity | null =
    invitation.creatorId === currentUserId
      ? invitation.target
      : invitation.creator
  const emptyUser: UserDisplayedEntity = {
    id: '',
    username: 'Unknown',
  }

  return (
    <FriendRow user={user ?? emptyUser}>
      <InvitationAnswerButtonsFeature invitation={invitation} />
    </FriendRow>
  )
}
