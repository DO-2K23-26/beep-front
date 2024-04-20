import { UserEntity } from '@beep/contracts'
import Message from '../ui/message'

interface MessageFeatureProps {
  message: string
  user?: UserEntity
  image?: string
  gif?: string
  video?: string
  onEdit?: () => void
  onDelete?: () => void
  createdAt?: string
  updatedAt?: string
}

const onEdit = () => {
  console.log('Edit message')
}

const onDelete = () => {
  console.log('Delete message')
}

export default function MessageFeature({
  user,
  message,
  createdAt,
}: MessageFeatureProps) {
  return (
    <Message
      user={user}
      message={message}
      onDelete={onDelete}
      onEdit={onEdit}
      createdAt={createdAt}
    />
  )
}
