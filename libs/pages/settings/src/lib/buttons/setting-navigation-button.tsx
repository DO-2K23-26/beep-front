import { Button } from '@beep/ui'

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
    <Button
      onClick={navigateTo}
      className={`${
        isPicked ? '!bg-violet-400' : '!bg-transparent'
      } !w-full hover:!bg-violet-100 hover:!rounded-lg !rounded-lg !p-x-2 text-base font-semibold !flex !justify-start`}
    >
      <p className="ml-2">{title}</p>
    </Button>
  )
}
