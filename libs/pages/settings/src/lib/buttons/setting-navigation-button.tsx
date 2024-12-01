import { ButtonShadCn } from '@beep/ui'
import { cn } from '@beep/utils'

export interface SettingPickerButtonProps {
  title: string
  navigateTo: () => void
  isPicked: boolean
}

export function SettingPickerButton({
  title,
  navigateTo,
  isPicked,
}: SettingPickerButtonProps) {
  return (
    <ButtonShadCn
      onClick={navigateTo}
      variant={'ghost'}
      className={cn(
        'w-full hover:bg-violet-100 rounded-lg p-x-1 sm:p-x-2 flex justify-start ',
        { 'bg-violet-400': isPicked }
      )}
    >
      <p className="text-xs sm:text-md md:text-base font-semibold max-w-14 sm:max-w-24 md:max-w-44 truncate">
        {title}
      </p>
    </ButtonShadCn>
  )
}
