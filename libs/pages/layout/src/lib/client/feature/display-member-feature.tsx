import { UserConnectedEntity } from '@beep/contracts'
import DisplayMember from '../ui/display-member'
import { useFetchProfilePictureQuery } from '@beep/user';

interface DisplayMemberFeatureProps {
  user: UserConnectedEntity
  isConnected: boolean
}

const onPrivateMessage = () => {
  console.log('Private message')
}

export default function DisplayMemberFeature({
  user,
  isConnected
}: DisplayMemberFeatureProps) {
  const profilePicture = useFetchProfilePictureQuery(user.id).currentData
  return <DisplayMember isConnected={isConnected} user={user} onPrivateMessage={onPrivateMessage} profilePicture={profilePicture} />
}
