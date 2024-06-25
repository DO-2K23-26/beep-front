import { classNames } from '@beep/utils'
import { RefObject } from 'react'
import { Icon } from '../icons/icon'

export interface InputPictureProps {
  label: string
  name: string
  disabled?: boolean
  className?: string
  customRef?: RefObject<HTMLInputElement>
  onChange?: (e: any) => void
}

export function InputPicture({
  label,
  disabled = false,
  className = '',
  name,
}: InputPictureProps): JSX.Element {
  const isDisabled = disabled ? 'input--disabled' : ''
  const uuid = Math.random().toString(36).substring(7)
  return (
    <label
      htmlFor={uuid.toString()}
      className="flex align-center items-center flex-col gap-2 opacity-40 hover:opacity-100 ease-in-out duration-75 w-fit cursor-pointer h-fit"
    >
      <div className="p-5 border-dashed border-black border-2 w-fit rounded-full">
        <Icon name="lucide:image-plus" className="h-7 w-7" />
        <input
          className="hidden"
          type="file"
          name={name}
          id={uuid.toString()}
        />
      </div>
      <label className={classNames(className, isDisabled)}>{label}</label>
    </label>
  )
}
