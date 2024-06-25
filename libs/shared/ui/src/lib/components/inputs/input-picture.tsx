import { RefObject } from 'react'

interface InputPictureProps {
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
  return (
    <div>
      <label className=""></label>
    </div>
  )
}
