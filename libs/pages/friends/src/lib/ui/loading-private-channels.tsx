import { cn } from '@beep/utils'
import { Skeleton } from '@beep/ui'

export function LoadingPrivateChannel() {
  const usernameWidth = ['w-3/4', 'w-1/3', 'w-3/5']
  // Pick a random body size between the list of sizes to display the message
  const pickedMessageWidth =
    usernameWidth[Math.floor(Math.random() * usernameWidth.length)]

  return (
    <Skeleton className="flex flex-row items-center bg-violet-500/50 w-full h-10 px-2 py-7">
      <Skeleton className="size-7 sm:size-8 md:size-10 rounded-lg bg-violet-300" />
      <Skeleton
        className={cn(' h-2 ml-2 w-6 bg-violet-300', pickedMessageWidth)}
      />
    </Skeleton>
  )
}
