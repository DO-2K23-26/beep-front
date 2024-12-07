import { UserDisplayedEntity } from '@beep/contracts'
import { useFetchProfilePictureQuery } from '@beep/user'
import { PropsWithChildren } from 'react'

interface FriendRowProps {
  user: UserDisplayedEntity
}

export function FriendRow({
  children,
  user,
}: PropsWithChildren<FriendRowProps>) {
  const { currentData: userProfilePicture } = useFetchProfilePictureQuery(
    user.id,
    {
      skip:
        user === undefined ||
        user.profilePicture === 'default_profile_picture.png' ||
        user.profilePicture === '',
    }
  )
  return (
    <div className="group flex flex-row h-15 md:h-16 p-2 justify-between rounded-md hover:bg-violet-500 items-center gap-3">
      {/* Avatar and username of the friend */}
      <div className="flex flex-row gap-3 items-center w-fit">
        <img
          className="flex size-8 sm:size-10 md:size-12 object-cover bg-violet-50 rounded-xl"
          src={userProfilePicture ?? '/picture.svg'}
          alt={user.username + '-img'}
        />
        <p className="text-xs sm:text-sm md:text-base font-medium">
          {user.username}
        </p>
      </div>
      {/* Display at the end of the row*/}
      {children}
    </div>
  )
}
