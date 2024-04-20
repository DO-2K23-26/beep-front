import { UserEntity } from '@beep/contracts'
import DisplayMember from '../ui/display-member'

interface DisplayMemberFeatureProps {
  user: UserEntity
}

const onPrivateMessage = () => {
  console.log('Private message')
}

export default function DisplayMemberFeature({
  user,
}: DisplayMemberFeatureProps) {
  return <DisplayMember user={user} onPrivateMessage={onPrivateMessage} />
}
