import { UserDisplayedEntity } from '@beep/contracts'
import { FriendRowFeature } from '../feature/friend-row-feature'
import { EmptyFriendsList } from './empty-friends-list'
import { LoadingFriendsList } from './loading-friends-list'

interface FriendsListProps {
  users?: UserDisplayedEntity[]
  loading?: boolean
}

export function FriendsList({ users, loading }: FriendsListProps) {
  if (loading || users === undefined) {
    return <LoadingFriendsList />
  }
  if (users === undefined || users.length === 0) {
    return <EmptyFriendsList />
  }
  return (
    <div className="flex flex-col p-4 divide-y  divide-violet-200/90">
      {users.map((user) => (
        <FriendRowFeature key={user.id} user={user} />
      ))}
    </div>
  )
}
