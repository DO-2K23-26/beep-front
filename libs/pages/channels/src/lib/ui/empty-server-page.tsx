import { Button, ButtonStyle, Icon } from '@beep/ui'
import { Icon as Iconify } from '@iconify/react'

interface EmptyServerPageProps {
  hideLeftDiv: () => void
  hideRightDiv: () => void
}

export function EmptyServerPage({
  hideLeftDiv,
  hideRightDiv,
}: EmptyServerPageProps) {
  return (
    <div className="flex flex-col w-full h-full bg-violet-200 justify-start p-6 items-center">
      <div className="flex flex-row gap-6 justify-between w-full">
        <Button
          style={ButtonStyle.SQUARE}
          className="lg:hidden !bg-violet-300"
          onClick={hideLeftDiv}
        >
          <Icon name="lucide:arrow-left" className="w-4 h-4" />
        </Button>
        <Button
          style={ButtonStyle.SQUARE}
          className="lg:hidden !bg-violet-300"
          onClick={hideRightDiv}
        >
          <Icon name="lucide:user" className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex flex-col justify-center items-center h-full w-1/2 space-y-4">
        <Iconify
          icon="lucide:message-circle-x"
          className="size-20"
          color=""
        ></Iconify>
        <div className="text-2xl font-semibold text-violet-950">
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
