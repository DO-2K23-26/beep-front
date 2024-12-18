import { Skeleton } from '@beep/ui'

export function LoadingFriendsList() {
  return (
    <div className="flex flex-col-reverse items-start justify-center p-4 gap-2">
      {[...Array(6)].map((_, index) => (
        <Skeleton
          key={'friend_skeleton_' + index}
          className={`h-14 md:h-15 w-full rounded-md
            bg-violet-500/40`}
        />
      ))}
    </div>
  )
}
