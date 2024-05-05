import { MessageEntity, UserEntity } from '@beep/contracts'
import Message from '../ui/message'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { getUserState } from '@beep/user'
import { useForm } from 'react-hook-form'

interface MessageFeatureProps {
  message: MessageEntity
  user?: UserEntity
  onUpdateMessage: (messageId: string) => void
  image?: string
  gif?: string
  video?: string
  createdAt: string
  updatedAt?: string
  control?: any
}

export default function MessageFeature({
  user,
  onUpdateMessage,
  message,
  createdAt,
  control
}: MessageFeatureProps) {
  const { tokens, isLoading, isAuthenticated, payload } = useSelector(getUserState)
  const methods = useForm({
    mode: 'onChange',
  })

  const [isEditing, setIsEditing] = useState<boolean>(false)

  const switchEditing = () => {
    setIsEditing((prevValue) => !prevValue)
  }

  const deleteMessage = () => {

  }


  return (
    <Message
      user={user}
      message={message}
      isEditing={isEditing}
      onDelete={payload && payload.sub === user?.id ? deleteMessage : null}
      switchEditing={payload && payload.sub === user?.id ? switchEditing : null}
      onUpdateMessage={() => { onUpdateMessage(message.id); switchEditing(); }}
      createdAt={createdAt}
      control={control}
    />
  )
}
