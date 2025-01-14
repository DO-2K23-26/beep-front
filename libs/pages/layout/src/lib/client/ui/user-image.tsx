import { Skeleton } from '@beep/ui'
import { useCurrentUser } from '../feature/current-user/current-user-context'

export default function UserImage() {
  const { userProfilePicture, isLoadingProfilePicture } = useCurrentUser()
  return (
    <div>
      {isLoadingProfilePicture || userProfilePicture === undefined ? (
        <Skeleton className="flex"></Skeleton>
      ) : (
        <img
          className="size-10 object-cover bg-violet-50 flex justify-center items-center rounded-lg"
          src={userProfilePicture}
          alt="Profilepicture"
        />
      )}
    </div>
  )
}
