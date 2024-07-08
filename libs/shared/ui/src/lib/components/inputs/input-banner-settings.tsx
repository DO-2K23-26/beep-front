import { useUpdateBannerMutation } from '@beep/server'
import { classNames } from '@beep/utils'
import { useEffect, useRef, useState } from 'react'
import { Icon } from '../icons/icon'

export interface InputBannerSettingsProps {
  label: string
  name: string
  serverId?: string
  initialBanner?: string
}

export function InputBannerSettings({
  label,
  name,
  serverId = '',
  initialBanner,
}: InputBannerSettingsProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>(
    initialBanner ?? null
  )
  const uuid = Math.random().toString(36).substring(7)
  const [updateBanner] = useUpdateBannerMutation()

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
            await updateBanner({ serverId, formData }).unwrap()
          } catch (error) {
            //TODO: handle error
          }
        }
      })
    }
  }, [serverId, updateBanner])

  useEffect(() => {
    if (initialBanner) {
      setPreviewImage(initialBanner)
    }
  }, [initialBanner])

  return (
    <label
      htmlFor={uuid.toString()}
      className={
        !activated
          ? classNames(
              'flex align-center items-center flex-col gap-2 group w-full cursor-pointer h-60',
              'cursor-pointer'
            )
          : classNames(
              'flex align-center items-center flex-col gap-2 cursor-pointer group w-full h-60'
            )
      }
    >
      <div
        className={
          !activated
            ? classNames(
                ' w-full h-60 rounded-xl flex items-center justify-center truncate'
              )
            : classNames('w-full h-60 rounded-xl')
        }
      >
        {previewImage ? (
          <img
            src={previewImage as string}
            alt="preview"
            className="w-full h-60 rounded-xl truncate object-cover"
          />
        ) : (
          <div className="w-full h-60 truncate bg-slate-300 flex items-center justify-center rounded-xl">
            <Icon name="lucide:image-plus" className="h-40 w-40" />
          </div>
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
