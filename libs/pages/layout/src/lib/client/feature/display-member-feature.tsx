import { UserConnectedEntity } from '@beep/contracts'
import DisplayMember from '../ui/display-member'

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
  return <DisplayMember isConnected={isConnected} user={user} onPrivateMessage={onPrivateMessage} />
}
