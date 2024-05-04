import { Button, ButtonStyle, Icon } from '@beep/ui'

export interface PageMeGeneralProps {
  hideRightDiv?: () => void
  hideLeftDiv?: () => void
}

export function PageMeGeneral({
  hideRightDiv,
  hideLeftDiv,
}: PageMeGeneralProps) {
  return (
    <div className="bg-violet-200 w-full p-6 flex flex-col gap-6 justify-between h-[100dvh]">
      {/* Message page Header */}
      <div className="flex flex-row justify-between gap-6">
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
    </div>
  )
}
