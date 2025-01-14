import { Skeleton } from '@beep/ui'
import { useCurrentUser } from '../feature/current-user/current-user-context'

export default function UserImage() {
  const { userProfilePicture, isLoadingProfilePicture } = useCurrentUser()
  return (
    <div>
      {isLoadingProfilePicture || userProfilePicture === undefined ? (
        <Skeleton
          id="test"
          className="h-10 w-10 flex justify-center items-center bg-violet-400"
        ></Skeleton>
      ) : (
        <img
          className="size-10 object-cover bg-violet-50 flex justify-center items-center rounded-lg"
          src={userProfilePicture || '/picture.svg'}
          alt="Profilepicture"
        />
      )}
    </div>
  )
}
