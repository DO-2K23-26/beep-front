import { useUpdateBannerMutation, useUpdatePictureMutation } from '@beep/server'
import { classNames } from '@beep/utils'
import { useEffect, useRef, useState } from 'react'
import { Icon } from '../icons/icon'

interface InputImageSettingsProps {
  label: string
  name: string
  serverId?: string
  initialImage?: string
  type: 'banner' | 'picture'
}

export function InputImageSettings({
  label,
  name,
  serverId = '',
  initialImage,
  type,
}: InputImageSettingsProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>(
    initialImage ?? null
  )
  const uuid = Math.random().toString(36).substring(7)

  const [updatePicture] = useUpdatePictureMutation()
  const [updateBanner] = useUpdateBannerMutation()

  const updateImage = type === 'banner' ? updateBanner : updatePicture

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
            await updateImage({ serverId, formData }).unwrap()
          } catch (error) {
            //TODO: handle error
          }
        }
      })
    }
  }, [serverId, updateImage])

  useEffect(() => {
    if (initialImage) {
      setPreviewImage(initialImage)
    }
  }, [initialImage])

  const containerClasses = classNames(
    'flex align-center items-center flex-col gap-2 group cursor-pointer w-full h-60'
  )

  const imageContainerClasses = classNames(
    'w-full h-60 rounded-xl flex items-center justify-center truncate',
    type === 'banner' ? 'w-full' : 'w-60'
  )

  const imageClasses = classNames(
    'object-cover',
    type === 'banner' ? 'w-full h-60 rounded-xl' : 'rounded-full w-60 h-60'
  )

  const placeholderClasses = classNames(
    'flex items-center justify-center',
    type === 'banner'
      ? 'w-full h-60 bg-slate-300 rounded-xl'
      : 'rounded-full w-60 h-60 bg-slate-300'
  )

  const labelClasses = classNames(
    'text-sm text-black cursor-pointer opacity-40 group-hover:opacity-100 ease-in-out duration-75'
  )

  return (
    <label htmlFor={uuid.toString()} className={containerClasses}>
      <div className={imageContainerClasses}>
        {previewImage ? (
          <img
            src={previewImage as string}
            alt="preview"
            className={imageClasses}
          />
        ) : (
          <div className={placeholderClasses}>
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
      <label className={labelClasses}>{label}</label>
    </label>
  )
}
