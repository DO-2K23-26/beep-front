import { UserDisplayedEntity } from '@beep/contracts'
import { useFetchProfilePictureQuery } from '@beep/user'
import DisplayMember from '../ui/display-member'

interface DisplayMemberFeatureProps {
  user: UserDisplayedEntity
  isConnected: boolean
}

const onPrivateMessage = () => {
  //TODO: Implement onPrivateMessage
}

export default function DisplayMemberFeature({
  user,
  isConnected,
}: DisplayMemberFeatureProps) {
  const profilePicture = useFetchProfilePictureQuery(user.id).currentData
  return (
    <DisplayMember
      isConnected={isConnected}
      user={user}
      onPrivateMessage={onPrivateMessage}
      profilePicture={profilePicture}
    />
  )
}
