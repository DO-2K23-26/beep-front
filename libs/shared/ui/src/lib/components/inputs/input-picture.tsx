import { classNames } from '@beep/utils'
import { RefObject, useEffect, useRef, useState } from 'react'
import { Icon } from '../icons/icon'
import { UseFormRegister } from 'react-hook-form'

interface WithIcon {
  icon: File
  [key: string]: unknown
}

export interface InputPictureProps {
  label: string
  disabled?: boolean
  className?: string
  customRef?: RefObject<HTMLInputElement>
  onChange?: (e: any) => void
  value: File | null
}

export function InputPicture({
  label,
  disabled = false,
  className = '',
  onChange,
  value,
}: InputPictureProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null)
  const isDisabled = disabled ? 'input--disabled' : ''
  const uuid = Math.random().toString(36).substring(7)

  const activated = value ? true : false

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
            src={previewImage as string}
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
