import { Button } from '@beep/shadcn'
import { ArrowRight } from 'lucide-react'

interface AuthButtonProps {
  onSubmit: () => void
  text: string
}

export default function AuthButton({ onSubmit, text }: AuthButtonProps) {
  const color = '#C4B5FD'

  return (
    <Button variant={'signin'} size={'signin'} onClick={onSubmit}>
      <p className="font-bold text-whiteV2">{text}</p>
      <ArrowRight className="w-6 h-6 text-whiteV2 font-bold" color={color} />
    </Button>
  )
}
