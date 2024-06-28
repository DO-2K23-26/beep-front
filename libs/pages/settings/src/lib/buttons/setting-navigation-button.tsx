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
      } hover:!bg-violet-100 hover:!rounded-lg !rounded-lg !p-0 text-base font-semibold items-center`}
    >
      <p>{title}</p>
    </Button>
  )
}
