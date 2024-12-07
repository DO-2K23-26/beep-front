import { UserDisplayedEntity } from '@beep/contracts'
import { FriendRow } from '../ui/friend-row'
import { FriendMenuRow } from '../ui/friend-menu-row'
import { Icon } from '@beep/ui'

interface FriendRowFeatureProps {
  user: UserDisplayedEntity
}

export function FriendRowFeature({ user }: FriendRowFeatureProps) {
  return (
    <FriendRow user={user}>
      <FriendMenuRow user={user}>
        <Icon
          name={'lucide:ellipsis-vertical'}
          className="h-6 w-6 sm:h-7 sm:w-7"
        />
      </FriendMenuRow>
    </FriendRow>
  )
}
