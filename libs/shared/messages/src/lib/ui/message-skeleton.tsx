import { Skeleton } from '@beep/ui'
import { cn } from '@beep/utils'
export function MessageSkeleton() {
  const messageBodySize = ['w-3/4', 'w-1/3', 'w-3/5', 'w-11/12', 'w-full']
  const messageAuthorWidth = ['w-[100px]', 'w-[85px]', 'w-[60px]', 'w-[150px]']
  // Pick a random body size between the list of sizes to display the message
  const pickedMessageWidth =
    messageBodySize[Math.floor(Math.random() * messageBodySize.length)]
  // Pick a random width for the message author username
  const pickedAuthorWidth =
    messageAuthorWidth[Math.floor(Math.random() * messageAuthorWidth.length)]

  const pulseColor = 'bg-violet-300'

  return (
    <div className="flex flex-col space-y-4 ">
      {/* Message header nickname/profile picture/date */}
      <div className="flex flex-row items-center space-x-3">
        {/* Icon profile picture of the owner*/}
        <Skeleton className={cn('w-9 h-9 rounded-xl', pulseColor)} />
        {/* Username */}
        <Skeleton
          className={cn('h-4 w-[12px]', pulseColor, pickedAuthorWidth)}
        />
        {/* Date */}
        <Skeleton className={cn('h-4 w-[50px]', pulseColor)} />
      </div>

      {/* Message content */}
      <div className="flex flex-row">
        <Skeleton
          className={cn(
            'w-3/4 h-20 rounded-xl rounded-tl-none',
            pulseColor,
            pickedMessageWidth
          )}
        />
      </div>
    </div>
  )
}
