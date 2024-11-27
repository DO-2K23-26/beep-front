import { Button } from '@beep/ui'

export interface WebhookPickerButtonProps {
  title: string
  navigateTo: () => void
  isPicked: boolean
}

export function WebhookPickerButton({
  title,
  navigateTo,
  isPicked,
}: WebhookPickerButtonProps) {
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
