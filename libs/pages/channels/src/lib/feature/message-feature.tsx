import { FormProvider, useForm } from 'react-hook-form'
import { MessageEntity, UserEntity } from '@beep/contracts'
import Message from '../ui/message'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import { getUserState, useFetchProfilePictureQuery } from '@beep/user';
import { useCreateMessageMutation, useFindAndDeleteMessageMutation, usePinMessageMutation } from '@beep/channel';
import toast from 'react-hot-toast';

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
  isPinned: boolean
}

export default function MessageFeature({
  user,
  message,
  createdAt,
  onUpdateMessage,
  editingMessageId,
  setEditingMessageId,
  isPinned
}: MessageFeatureProps) {
  const [pinMessage, result] = usePinMessageMutation()
  const [createMessage] = useCreateMessageMutation()
  const [findAndDeleteMessage] = useFindAndDeleteMessageMutation()
  const { tokens, isLoading, isAuthenticated, payload } = useSelector(getUserState)


  const userProfilePicture = user ? useFetchProfilePictureQuery(user.id, {
    skip: !user
  }).currentData : undefined

  const isEditing = editingMessageId === message.id

  const methods = useForm({
    mode: 'onChange',
  })


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

  const deleteMessage = () => {}


  const onPin = async () => {
    try {
      await pinMessage({ channelId: message.channelId, messageId: message.id });
    } catch (error) {
      toast.error('Failure while trying to pin the message');
    }
  };


  useEffect(() => {
    if (result.isSuccess) {
      console.log(result.data.pinned)

      if(result.data.pinned === true) {
        toast.success('Message pinned!');
        const notificationMessage = `The message with ID ${message.id} is pinned.`;
        const formData = new FormData();
        formData.set('content', notificationMessage);

        createMessage({
          channelId: message.channelId,
          body: formData
        });
      } else {
        findAndDeleteMessage({
          channelId: message.channelId,
          messageId: message.id
        
        })
        toast.success('Message unpinned!');
      }
    } else if (result.isError) {
      toast.error('Failure while trying to pin the message');
    }
  }, [createMessage, findAndDeleteMessage, message.channelId, message.id, result])

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
        onPin={onPin}
      isPinned={isPinned}
    />
    </FormProvider>
  )
}
