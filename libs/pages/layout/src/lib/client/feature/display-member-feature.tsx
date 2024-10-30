import { MemberEntity } from '@beep/contracts'
import { useFetchProfilePictureQuery } from '@beep/user'
import DisplayMember from '../ui/display-member'

interface DisplayMemberFeatureProps {
  member: MemberEntity
  isConnected: boolean
}

const onPrivateMessage = () => {
  //TODO: Implement onPrivateMessage
}

export default function DisplayMemberFeature({
  member,
  isConnected,
}: DisplayMemberFeatureProps) {
  const { currentData: userProfilePicture } = useFetchProfilePictureQuery(
    member.userId
  )
  return (
    <DisplayMember
      isConnected={isConnected}
      member={member}
      onPrivateMessage={onPrivateMessage}
      profilePicture={userProfilePicture}
    />
  )
}
