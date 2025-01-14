import { Skeleton } from "@beep/ui"
import { useCurrentUser } from "../feature/current-user/current-user-context"

export default function Username() {
  const { user, isLoadingUser } = useCurrentUser()
  return (
    <div>
      {isLoadingUser || user?.username !== undefined ? (
        <Skeleton className="max-w-12 md:max-w-24"></Skeleton>
      ) : (
        <div className="font-bold text-xs md:text-base max-w-12 md:max-w-24 truncate">
          {user?.username}
        </div>
      )}
    </div>
  )
}
