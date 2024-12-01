import { useGetMyFriendsQuery } from '@beep/friend'
import { DisplayFriends } from '../ui/display-friends'

export function DisplayFriendsFeature() {
  const { data: friends, isLoading: isLoadingFriends } = useGetMyFriendsQuery()
  return (
    <DisplayFriends friends={friends} isLoadingFriends={isLoadingFriends} />
  )
}
