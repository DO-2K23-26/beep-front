import { UserConnectedEntity, UserEntity } from '@beep/contracts'
import DisplayMember from '../ui/display-member'
import { useFetchProfilePictureQuery } from '@beep/user'

interface DisplayMemberFeatureProps {
  user: UserEntity
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
