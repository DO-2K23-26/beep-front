import { classNames } from '@beep/utils'
import { useRef } from 'react'
import { Icon } from '../icons/icon'

export interface InputPictureProps {
  label: string
  onChange?: (e: any) => void
  value: File | null
}

export function InputPicture({
  label,
  onChange,
  value,
}: InputPictureProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null)
  const uuid = Math.random().toString(36).substring(7)

  const activated = !!value

  const previewImage = value ? URL.createObjectURL(value) : null

  return (
    <label
      htmlFor={uuid.toString()}
      className={
        !activated
          ? classNames(
              'flex align-center items-center flex-col gap-2 group w-fit cursor-pointer h-fit',
              'cursor-pointer'
            )
          : classNames(
              'flex align-center items-center flex-col gap-2 cursor-pointer group w-fit h-fit'
            )
      }
    >
      <div
        className={
          !activated
            ? classNames(
                'p-5 border-dashed border-black border-2 w-fit rounded-full'
              )
            : classNames(
                'flex align-center items-center flex-col gap-2 cursor-pointer w-fit h-fit '
              )
        }
      >
        {previewImage ? (
          <img
            src={previewImage}
            alt="preview"
            className="h-20 rounded-md"
          />
        ) : (
          <Icon name="lucide:image-plus" className="h-5 w-5" />
        )}
        <input
          className="hidden"
          type="file"
          id={uuid.toString()}
          ref={inputRef}
          onChange={onChange}
        />
      </div>
      <label
        className={
          !activated
            ? classNames('text-sm text-black cursor-pointer')
            : classNames(
                'text-sm text-black cursor-pointer opacity-40 group-hover:opacity-100 ease-in-out duration-75'
              )
        }
      >
        {activated ? 'Change picture' : label}
      </label>
    </label>
  )
}
