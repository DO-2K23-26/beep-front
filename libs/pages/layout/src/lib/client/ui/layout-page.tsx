import { getResponsiveState } from '@beep/responsive'
import { Button, ButtonStyle, Icon } from '@beep/ui'
import { PropsWithChildren, ReactElement, useId } from 'react'
import { useSelector } from 'react-redux'

export interface LayoutPageProps {
  hideRightDiv?: () => void
  rightPanel?: ReactElement | undefined
  leftPanel?: ReactElement | undefined
}

export default function LayoutPage({
  children,
  hideRightDiv,
  leftPanel,
  rightPanel,
}: PropsWithChildren<LayoutPageProps>) {
  const id: string = useId()
  const { showRightPane, showLeftPane } = useSelector(getResponsiveState)

  return (
    <div className="h-screen flex bg-violet-500">
      {/* Left channels navigation pane */}
      {leftPanel}
      {/* Chat content */}
      <div
        key={id}
        className={showLeftPane || showRightPane ? 'hidden' : 'flex w-full'}
      >
        {children}
      </div>

      {/* Right members & servers navigation pane */}
      <div className={showRightPane ? 'flex abolute w-full' : 'hidden lg:flex'}>
        {/* Responsive button */}
        {rightPanel}
        <div className="p-6 bg-violet-200 lg:hidden">
          <Button
            style={ButtonStyle.SQUARE}
            onClick={hideRightDiv}
            className="!bg-violet-300"
          >
            <Icon name="lucide:user" className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
