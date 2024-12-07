import { cn } from '@beep/utils'
import { ButtonShadCn, Icon } from '@beep/ui'

interface RoundAnswerButtonProps {
  onClick: () => void
  className?: string
  icon: string
}

export function RoundAnswerButton({
  onClick,
  icon,
  className,
}: RoundAnswerButtonProps) {
  return (
    <ButtonShadCn
      variant={'ghost'}
      onClick={onClick}
      className={cn(
        'size-8 sm:size-9 md:size-10 rounded-full bg-violet-500 group-hover:bg-violet-300 transition-colors',
        className
      )}
    >
      <Icon className="size-4 sm:size-5 md:size-6" name={icon} />
    </ButtonShadCn>
  )
}
