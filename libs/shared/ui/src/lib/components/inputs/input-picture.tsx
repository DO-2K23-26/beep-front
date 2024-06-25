import { classNames } from '@beep/utils'
import { RefObject, useEffect, useRef, useState } from 'react'
import { Icon } from '../icons/icon'

export interface InputPictureProps {
  label: string
  name: string
  disabled?: boolean
  className?: string
  customRef?: RefObject<HTMLInputElement>
}

export function InputPicture({
  label,
  disabled = false,
  className = '',
  name,
}: InputPictureProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>(
    null
  )
  const isDisabled = disabled ? 'input--disabled' : ''
  const uuid = Math.random().toString(36).substring(7)

  const activated = previewImage ? true : false

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener('change', () => {
        if (inputRef.current?.files) {
          const file = inputRef.current.files[0]
          const reader = new FileReader()
          reader.onload = (e) => {
            const image = e.target?.result
            if (image) setPreviewImage(image)
          }
          reader.readAsDataURL(file)
        }
      })
    }
  }, [])

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
            src={previewImage as string}
            alt="preview"
            className="h-20 rounded-md"
          />
        ) : (
          <Icon name="lucide:image-plus" className="h-5 w-5" />
        )}
        <input
          ref={inputRef}
          className="hidden"
          type="file"
          name={name}
          id={uuid.toString()}
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
