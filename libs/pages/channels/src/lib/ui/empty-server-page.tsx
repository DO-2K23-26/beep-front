import { Icon } from '@iconify/react'

export function EmptyServerPage() {
  return (
    <div className="flex flex-col w-full h-full bg-violet-200 justify-center items-center">
      <div className="flex flex-col justify-center items-center w-1/2 space-y-4">
        <Icon
          icon="lucide:message-circle-x"
          className="size-20"
          color=""
        ></Icon>
        <div className="text-2xl font-semibold text-violet-950 text-center">
          NO TEXT CHANNELS
        </div>
        <div className="text-2xl  text-violet-950 text-center">
          You can create as many channel as you want. Click on create channel on
          the left pane !
        </div>
      </div>
    </div>
  )
}
