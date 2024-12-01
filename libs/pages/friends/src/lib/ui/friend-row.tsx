import { UserDisplayedEntity } from '@beep/contracts'
import { Icon } from '@beep/ui'
import { FriendMenuRow } from './friend-menu-row'

interface FriendRowProps {
  user: UserDisplayedEntity
}

export function FriendRow({ user }: FriendRowProps) {
  return (
    <div className="flex flex-row h-15 md:h-16 p-2 justify-between rounded-md hover:bg-violet-500 items-center">
      {/* Avatar and username of the friend */}
      <div className="flex flex-row">
        <img
          className="w-8 h-8 sm:w-9 sm:h-9 object-cover bg-violet-50 rounded-xl"
          src={user.profilePicture ?? '/picture.svg'}
          alt={user.username + '-img'}
        />
        <div className="flex flex-col justify-center ml-4">
          <p className="text-md sm:text-lg font-medium">{user.username}</p>
        </div>
      </div>
      {/* Button to remove the friend */}
      <FriendMenuRow user={user}>
        <Icon
          name={'lucide:ellipsis-vertical'}
          className="h-6 w-6 sm:h-7 sm:w-7"
        />
      </FriendMenuRow>
    </div>
  )
}
