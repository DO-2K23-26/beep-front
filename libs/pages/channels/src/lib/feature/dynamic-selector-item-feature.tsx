import { UserDisplayedEntity } from '@beep/contracts'
import { useFetchProfilePictureQuery } from '@beep/user'
import { skipToken } from '@reduxjs/toolkit/query'

export interface DynamicSelectorProps {
  user: UserDisplayedEntity
}

export const DynamicSelectorFeature = ({ user }: DynamicSelectorProps) => {
  const { currentData: userProfilePicture } = useFetchProfilePictureQuery(
    user.id ?? skipToken
  )

  return (
    <div className="flex items-center gap-4">
      <img
        className="w-9 min-w-[36px] h-9 min-h-[36px] object-cover bg-violet-50 rounded-xl"
        src={userProfilePicture ?? '/picture.svg'}
        alt={user.username + "'s profile picture"}
      />
      <p>{user.username}</p>
    </div>
  )
}
