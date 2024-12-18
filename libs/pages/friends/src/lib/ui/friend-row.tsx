import { UserDisplayedEntity } from '@beep/contracts'
import { cn } from '@beep/utils'
import { useFetchProfilePictureQuery } from '@beep/user'
import { PropsWithChildren } from 'react'

export enum ProfilePictureSize {
  Small = 'size-6 sm:size-7 md:size-9',
  Medium = 'size-7 sm:size-8 md:size-10',
  Large = 'size-9 sm:size-10 md:size-12',
}

interface FriendRowProps {
  user: UserDisplayedEntity
  className?: string
  responsiveProfilePicture?: boolean
  profilePictureSize?: ProfilePictureSize
}

export function FriendRow({
  children,
  user,
  className,
  responsiveProfilePicture,
  profilePictureSize = ProfilePictureSize.Medium,
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
    <div
      className={cn(
        'group flex flex-row py-1 sm:py-2 px-1 sm:px-2 justify-between rounded-md hover:bg-violet-500 transition-all items-center gap-3 w-full',
        className
      )}
    >
      {/* Avatar and username of the friend */}
      <div className="flex flex-row gap-1 sm:gap-3 items-center w-full">
        <img
          className={cn(
            'flex size-7 sm:size-8 md:size-10 object-cover bg-violet-50 rounded-xl',
            profilePictureSize,
            { 'hidden sm:flex': responsiveProfilePicture }
          )}
          src={userProfilePicture ?? '/picture.svg'}
          alt={user.username + '-img'}
        />
        <p className="text-xs sm:text-sm md:text-base font-medium max-w-40 sm:max-w-60 md:max-w-80 lg:max-w-96 truncate">
          {user.username}
        </p>
      </div>
      {/* Display at the end of the row*/}
      {children}
    </div>
  )
}
