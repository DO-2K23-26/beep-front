import { Icon } from '@iconify/react'

export function EmptyPinnedMessageList() {
  return (
    <div className="flex flex-col justify-center items-center space-y-4 w-full h-full ">
      <Icon icon="lucide:message-circle-x" className="size-10" color=""></Icon>
      <div className="text-center font-semibold text-violet-950 px-4">
        No pinned messages
      </div>
    </div>
  )
}
