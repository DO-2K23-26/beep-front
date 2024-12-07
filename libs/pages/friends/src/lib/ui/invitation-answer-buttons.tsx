import { cn } from '@beep/utils'
import { RoundAnswerButton } from './round-answer-button'

interface InvitationAnswerButtonsProps {
  onAccept: () => void
  onDecline: () => void
  displayAccept?: boolean
}

export function InvitationAnswerButtons({
  onAccept,
  onDecline,
  displayAccept,
}: InvitationAnswerButtonsProps) {
  return (
    <div className="flex flex-row gap-2 w-fit">
      <RoundAnswerButton
        onClick={onAccept}
        icon="lucide:check"
        className={cn('hover:!bg-green-500', {
          "hidden": !displayAccept,
        })}
      />
      <RoundAnswerButton
        onClick={onDecline}
        icon="lucide:x"
        className="hover:!bg-red-500"
      />
    </div>
  )
}
