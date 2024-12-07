import { UserDisplayedEntity } from '@beep/contracts'
import { FriendsList } from './friends-list'

interface DisplayFriendsProps {
  friends?: UserDisplayedEntity[]
  isLoadingFriends: boolean
}
export function DisplayFriends({
  friends,
  isLoadingFriends,
}: DisplayFriendsProps) {
  return (
    <div className="flex flex-col size-full justify-start p-y-1 md:p-y-4 overflow-y-scroll scroll-smooth">
      <FriendsList users={friends} loading={isLoadingFriends} />
    </div>
  )
}
