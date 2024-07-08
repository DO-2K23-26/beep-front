import { useUpdatePictureMutation } from '@beep/server'
import { classNames } from '@beep/utils'
import { useEffect, useRef, useState } from 'react'
import { Icon } from '../icons/icon'

export interface InputPictureSettingsProps {
  label: string
  name: string
  serverId?: string
  initialPicture?: string
}

export function InputPictureSettings({
  label,
  name,
  serverId = '',
  initialPicture,
}: InputPictureSettingsProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>(
    initialPicture ?? null
  )
  const uuid = Math.random().toString(36).substring(7)
  const [updatePicture] = useUpdatePictureMutation()

  const activated = !!previewImage

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener('change', async () => {
        if (inputRef.current?.files) {
          const file = inputRef.current.files[0]
          const reader = new FileReader()
          reader.onload = (e) => {
            const image = e.target?.result
            if (image) {
              setPreviewImage(image)
            }
          }
          reader.readAsDataURL(file)
          const formData = new FormData()
          formData.append('attachment', file)

          try {
            await updatePicture({ serverId, formData }).unwrap()
          } catch (error) {
            //TODO: handle error
          }
        }
      })
    }
  }, [serverId, updatePicture])

  useEffect(() => {
    if (initialPicture) {
      setPreviewImage(initialPicture)
    }
  }, [initialPicture])

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
      <div>
        {previewImage ? (
          <img
            src={previewImage as string}
            alt="preview"
            className="rounded-full  truncate  flex items-center justify-center object-cover w-60 h-60"
          />
        ) : (
          <p className="rounded-full truncate w-60 h-60 bg-slate-300 flex items-center justify-center text-black">
            <Icon name="lucide:image-plus" className="h-40 w-40" />
          </p>
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
