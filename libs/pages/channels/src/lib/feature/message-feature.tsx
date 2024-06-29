import { FormProvider } from 'react-hook-form'
import { MessageEntity, UserEntity } from '@beep/contracts'
import Message from '../ui/message'
import { useSelector } from 'react-redux'
import { getUserState, useFetchProfilePictureQuery } from '@beep/user'
import { useForm } from 'react-hook-form'

interface MessageFeatureProps {
  message: MessageEntity
  user?: UserEntity
  onUpdateMessage: (messageId: string, newContent: string) => void
  image?: string
  gif?: string
  video?: string
  createdAt: string
  updatedAt?: string
  control?: any
  editingMessageId: string | null
  setEditingMessageId: (id: string | null) => void
}

export default function MessageFeature({
  user,
  message,
  createdAt,
  onUpdateMessage,
  editingMessageId,
  setEditingMessageId
}: MessageFeatureProps) {
  const { tokens, isLoading, isAuthenticated, payload } = useSelector(getUserState)

  const methods = useForm({
    mode: 'onChange',
  })

  const userProfilePicture = user ? useFetchProfilePictureQuery(user!.id, {
    skip: !user
  }).currentData : undefined

  const isEditing = editingMessageId === message.id

  const switchEditing = () => {
    if (editingMessageId && editingMessageId !== message.id) {
      setEditingMessageId(null)
    }
    methods.reset({ message: message.content })

    setEditingMessageId(message.id)
  }

  const cancelEditing = () => {
    methods.reset({ message: message.content });
    setEditingMessageId(null);
  };

  const deleteMessage = () => {

  }

  const onUpdateMessageSubmit = methods.handleSubmit((data) => {
    try {
      if ((data.message !== '' && data.message !== undefined) &&
        (payload && payload.sub === user?.id)) {
        onUpdateMessage(message.id, data.message)
        methods.setValue('message', '')
        setEditingMessageId(null)
      }
    } catch (error) {
      console.error("Error updating message:", error)
    }
  })

  return (
    <FormProvider {...methods}>
      <Message
      user={user}
      message={message}
      profilePicture={userProfilePicture}
      isEditing={isEditing}
      onDelete={payload && payload.sub === user?.id ? deleteMessage : null}
      switchEditing={payload && payload.sub === user?.id ? switchEditing : null}
      cancelEditing={cancelEditing}
      onUpdateMessage={onUpdateMessageSubmit}
      createdAt={createdAt}
      payload={payload}
      />
    </FormProvider>
  )
}
