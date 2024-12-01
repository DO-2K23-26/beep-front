import { UserDisplayedEntity } from '@beep/contracts'
import { FriendRow } from '../ui/friend-row'

interface FriendRowFeatureProps {
  user: UserDisplayedEntity
}

export function FriendRowFeature({ user }: FriendRowFeatureProps) {
  
  return <FriendRow user={user} />
}
