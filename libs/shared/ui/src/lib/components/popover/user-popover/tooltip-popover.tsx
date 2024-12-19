import { PropsWithChildren, useState } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../tooltip/tooltip'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface UserPopoverProps {
  content: string
}

export function TooltipPopover({
  children,
  content,
}: PropsWithChildren<UserPopoverProps>) {
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false)
  return (
    <Tooltip open={tooltipOpen}>
      <TooltipTrigger
        onMouseEnter={() => setTooltipOpen(true)}
        onMouseLeave={() => setTooltipOpen(false)}
        asChild
      >
        <div>{children}</div>
      </TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  )
}
