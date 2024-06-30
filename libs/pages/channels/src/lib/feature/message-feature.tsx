import { FormProvider, useForm } from 'react-hook-form'
import Message from '../ui/message'
import { MessageEntity, UserDisplayedEntity, UserEntity } from '@beep/contracts'
import React, { ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux'
import { getUserState, useFetchProfilePictureQuery } from '@beep/user';
import { useCreateMessageMutation, useFindAndDeleteMessageMutation, usePinMessageMutation } from '@beep/channel';
import toast from 'react-hot-toast';

interface MessageFeatureProps {
  message: MessageEntity
  user?: UserEntity
  image?: string
  gif?: string
  video?: string
  createdAt: string
  updatedAt?: string
  onUpdateMessage: (messageId: string, newContent: string) => void
  editingMessageId: string | null
  setEditingMessageId: (id: string | null) => void
  isPinned: boolean
  findUserForTag: (value: string) => UserDisplayedEntity | undefined
  selectedTaggedUser: UserDisplayedEntity | undefined
  setSelectedTaggedUser: React.Dispatch<React.SetStateAction<UserDisplayedEntity | undefined>>
}

export default function MessageFeature({
  message,
  user,
  image,
  gif,
  video,
  createdAt,
  updatedAt,
  onUpdateMessage,
  editingMessageId,
  setEditingMessageId,
  isPinned,
  findUserForTag,
  selectedTaggedUser,
  setSelectedTaggedUser
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
  
  const replaceTagEntity = (message: ReactNode): ReactNode => {
    if (!findUserForTag) return message;

    const regex = /@\$(?:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/ig;

    const replaceText = (text: string): ReactNode => {
        const parts: ReactNode[] = [];
        let lastIndex = 0;

        text.replace(regex, (match, offset) => {
            const user = findUserForTag(match);
            parts.push(text.slice(lastIndex, offset));
            parts.push(
              <span
              key={offset}
              className={'bg-violet-300 p-1 rounded ' + (user ? 'cursor-pointer' : '')}
              onClick={() => user && onClickTag(user)}
              >
                {user ? '@' + user.username : 'undefined user'}
              </span>
            );
            lastIndex = offset + match.length;
            return match;
        });

        parts.push(text.slice(lastIndex));
        return parts;
    };

    const recurseChildren = (node: ReactNode): ReactNode => {
        if (typeof node === 'string') {
            return replaceText(node);
        } else if (React.isValidElement(node)) {
            return React.cloneElement(node, {}, React.Children.map(node.props.children, child => recurseChildren(child)));
        } else if (Array.isArray(node)) {
            return node.map(recurseChildren);
        } else {
            return node;
        }
    };

    return recurseChildren(message);
  };

  const onClickTag = (user: UserDisplayedEntity) => {
    !selectedTaggedUser || selectedTaggedUser && (selectedTaggedUser.id !== user.id) ?
      setSelectedTaggedUser(user) :
      setSelectedTaggedUser(undefined)
  }

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
        replaceTagEntity={replaceTagEntity}
        isHighlighted={message.content.includes('@$' + payload?.sub)}
        onPin={onPin}
        isPinned={isPinned}
      />
    </FormProvider>
  )
}