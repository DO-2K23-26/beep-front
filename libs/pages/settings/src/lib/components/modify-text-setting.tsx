import { ReactNode } from 'react'

interface ModifyTextSettingProps {
  title: string
  value: string
  modalButton: ReactNode
}

export function ModifyTextSetting({
  title,
  value,
  modalButton: modal,
}: ModifyTextSettingProps) {
  return (
    <div className="flex max-[500px]:flex-col gap-4 sm:gap-0 flex-row justify-between items-center">
      <div className="flex flex-col">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-sm">{value}</p>
      </div>
      {modal}
    </div>
  )
}
