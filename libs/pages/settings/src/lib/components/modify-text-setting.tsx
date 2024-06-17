import { Button } from "@beep/ui"

interface ModifyTextSettingProps {
  title: string
  value: string
  onClick: () => void
}

export function ModifyTextSetting({
  title,
  value,
  onClick,
}: ModifyTextSettingProps) {
  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex flex-col">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-sm">{value}</p>
      </div>
      <Button onClick={onClick}>
        <p>Modify</p>
      </Button>
    </div>
  )
}
