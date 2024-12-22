import { X } from 'lucide-react'

interface AuthErrorProps {
  error?: string
}

export default function AuthError({ error }: AuthErrorProps) {
  const color = '#C4B5FD'

  return (
    <div className="flex flex-row gap-1 px-4">
      <X color={color} className="w-4 h-4" />
      <p className="font-medium text-xs text-errorV2">{error}</p>
    </div>
  )
}
