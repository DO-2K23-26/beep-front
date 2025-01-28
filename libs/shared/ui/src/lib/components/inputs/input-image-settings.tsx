import { useUpdateBannerMutation, useUpdatePictureMutation } from '@beep/server'
import { cn } from '@beep/utils'
import { useEffect, useRef, useState } from 'react'
import { Icon } from '../icons/icon'

interface InputImageSettingsProps {
  label: string
  name: string
  serverId: string | undefined
  initialImage?: string
  type: 'banner' | 'picture'
}

export function InputImageSettings({
  label,
  name,
  serverId,
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
          updateImage({ serverId: serverId ?? '' , formData })
        }
      })
    }
  }, [serverId, updateImage])

  useEffect(() => {
    if (initialImage) {
      setPreviewImage(initialImage)
    }
  }, [initialImage])

  const size = 'w-full'
  const height = 'h-20 sm:h-28 md:h-40'
  const containerClasses = cn(
    'flex align-center items-center flex-col gap-2 group cursor-pointer w-full'
  )

  const imageContainerClasses = cn(
    'rounded-3xl flex items-center justify-center truncate',
    height,
    size
  )

  const imageClasses = cn('object-cover rounded-3xl', size, height)

  const placeholderClasses = cn(
    'flex items-center justify-center bg-slate-300 rounded-3xl',
    height,
    size
  )

  const labelClasses = cn(
    'text-xs sm:text-sm md:text-base text-black cursor-pointer opacity-40 group-hover:opacity-100 ease-in-out duration-75'
  )

  return (
    <label htmlFor={uuid} className={containerClasses}>
      <div className={imageContainerClasses}>
        {previewImage ? (
          <img
            src={previewImage as string}
            alt="preview"
            className={imageClasses}
          />
        ) : (
          <div className={placeholderClasses}>
            <Icon
              name="lucide:image-plus"
              className="size-10 sm:size-20"
            />
          </div>
        )}
        <input
          ref={inputRef}
          className="hidden"
          type="file"
          name={name}
          id={uuid}
        />
      </div>
      <label className={labelClasses}>{label}</label>
    </label>
  )
}
