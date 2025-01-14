import { Skeleton } from '@beep/ui'
import { useCurrentUser } from '../feature/current-user/current-user-context'

export default function UserImage() {
  const {
    userProfilePicture,
    isLoadingProfilePicture,
    isErrorProfilePicture,
    isSuccessProfilePicture,
  } = useCurrentUser()
  return (
    <div>
      {isLoadingProfilePicture ||
      (!isSuccessProfilePicture && !isErrorProfilePicture) ? (
        <Skeleton
          id="test"
          className="h-10 w-10 flex justify-center items-center bg-violet-400"
        />
      ) : (
        <img
          className="size-10 object-cover bg-violet-50 flex justify-center items-center rounded-lg"
          src={
            isErrorProfilePicture || userProfilePicture === undefined
              ? '/picture.svg'
              : userProfilePicture
          }
          alt="Profilepicture"
        />
      )}
    </div>
  )
}
