import { useGetMyFriendInvitationsQuery } from '@beep/friend'
import { PageInvitation } from '../ui/page-invitation'

export function PageInvitationFeature() {
  const { data: invitations } = useGetMyFriendInvitationsQuery()

  return <PageInvitation invitations={invitations} />
}
