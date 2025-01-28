import { MemberEntity } from '@beep/contracts'
import { useFetchProfilePictureQuery } from '@beep/user'
import { cn } from '@beep/utils'
import { PropsWithChildren } from 'react'

export enum ProfilePictureSize {
  Small = 'size-6 sm:size-7 md:size-9',
  Medium = 'size-7 sm:size-8 md:size-10',
  Large = 'size-9 sm:size-10 md:size-12',
}

interface MemberRowProps {
  member: MemberEntity
  className?: string
  responsiveProfilePicture?: boolean
  profilePictureSize?: ProfilePictureSize
  onClick?: () => void
}

export function MemberRow({
  children,
  member: { userId, nickname },
  className,
  responsiveProfilePicture,
  onClick,
  profilePictureSize = ProfilePictureSize.Medium,
}: PropsWithChildren<MemberRowProps>) {
  const { currentData: userProfilePicture } =
    useFetchProfilePictureQuery(userId)
  return (
    <div
      onClick={onClick}
      className={cn(
        'group flex flex-row py-1 px-1 sm:px-2 justify-between rounded-md hover:bg-violet-500 transition-all items-center gap-3 w-full',
        className,
        { 'cursor-pointer': onClick }
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
          alt={nickname + '-img'}
        />
        <p className="text-xs sm:text-sm md:text-base max-w-40 sm:max-w-60 md:max-w-80 lg:max-w-96 truncate">
          {nickname}
        </p>
      </div>
      {/* Display at the end of the row*/}
      {children}
    </div>
  )
}
