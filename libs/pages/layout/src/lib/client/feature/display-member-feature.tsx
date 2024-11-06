import { MemberEntity } from '@beep/contracts'
import { useFetchProfilePictureQuery, useGetUserByIdQuery } from '@beep/user'
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
  const { data: user } = useGetUserByIdQuery({ id: member.userId })
  const { currentData: userProfilePicture } = useFetchProfilePictureQuery(
    member.userId,
    {
      skip:
        user === undefined ||
        user.profilePicture === undefined ||
        user.profilePicture === 'default_profile_picture.png',
    }
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
