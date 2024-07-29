import { Skeleton } from '@beep/ui'
import { cn } from '@beep/utils'

export function DisplayMemberSkeleton() {
  const usernameWidth = ['w-1/3', 'w-5/12', 'w-1/2']
  // Pick a random body size between the list of sizes to display the message
  const pickedUsernameWidth =
    usernameWidth[Math.floor(Math.random() * usernameWidth.length)]
  const pulseColor = 'bg-violet-500/30'
  return (
    <div className="flex flex-row w-full items-center space-x-4 p-2">
      <Skeleton className={cn('w-9 h-9 rounded-lg', pulseColor)} />
      <Skeleton className={cn('w-6/12 h-4', pulseColor, pickedUsernameWidth)} />
    </div>
  )
}
