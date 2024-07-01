import {
  useCreateMessageMutation,
  useFindAndDeleteMessageMutation,
  usePinMessageMutation,
} from '@beep/channel'
import {
  ChannelEntity,
  MessageEntity,
  UserDisplayedEntity,
  UserEntity,
} from '@beep/contracts'
import { getServersState } from '@beep/server'
import { getUserState, useFetchProfilePictureQuery } from '@beep/user'
import React, { ReactNode, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Message from '../ui/message'

interface MessageFeatureProps {
  message: MessageEntity
  user?: UserEntity
  image?: string
  gif?: string
  video?: string
  createdAt: string
  updatedAt?: string
  onUpdateMessage: (messageId: string, newContent: string) => void
  onDeleteMessage: (channelId: string, messageId: string) => void
  editingMessageId: string | null
  setEditingMessageId: (id: string | null) => void
  isPinned: boolean
  findUserForTag: (value: string) => UserDisplayedEntity | undefined
  selectedTaggedUser: UserDisplayedEntity | undefined
  setSelectedTaggedUser: React.Dispatch<
    React.SetStateAction<UserDisplayedEntity | undefined>
  >
  findChannelForTag: (tag: string) => ChannelEntity | undefined
  selectedTaggedChannel: ChannelEntity | undefined
  setSelectedTaggedChannel: React.Dispatch<
    React.SetStateAction<ChannelEntity | undefined>
  >
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
  onDeleteMessage,
  editingMessageId,
  setEditingMessageId,
  isPinned,
  findUserForTag,
  selectedTaggedUser,
  setSelectedTaggedUser,
  findChannelForTag,
  selectedTaggedChannel,
  setSelectedTaggedChannel,
}: MessageFeatureProps) {
  const [pinMessage, result] = usePinMessageMutation()
  const [createMessage] = useCreateMessageMutation()
  const [findAndDeleteMessage] = useFindAndDeleteMessageMutation()
  const serverData = useSelector(getServersState)
  const userId: string | undefined = useSelector(getUserState).payload?.sub
  const navigate = useNavigate()
  const userProfilePicture = user
    ? useFetchProfilePictureQuery(user.id, {
        skip: !user,
      }).currentData
    : undefined

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
    methods.reset({ message: message.content })
    setEditingMessageId(null)
  }

  const onPin = async () => {
    try {
      await pinMessage({ channelId: message.channelId, messageId: message.id })
    } catch (error) {
      toast.error('Failure while trying to pin the message')
    }
  }

  function isUserMessageOwner(): boolean {
    if (userId) return userId === user?.id
    return false
  }

  function isUserServerOwner(): boolean {
    if (userId) return userId === serverData.server?.ownerId
    return false
  }

  useEffect(() => {
    if (result.isSuccess) {
      console.log(result.data.pinned)

      if (result.data.pinned) {
        toast.success('Message pinned!')
        const notificationMessage = `The message with ID ${message.id} is pinned.`
        const formData = new FormData()
        formData.set('content', notificationMessage)

        createMessage({
          channelId: message.channelId,
          body: formData,
        })
      } else {
        findAndDeleteMessage({
          channelId: message.channelId,
          messageId: message.id,
        })
        toast.success('Message unpinned!')
      }
    } else if (result.isError) {
      toast.error('Failure while trying to pin the message')
    }
  }, [
    createMessage,
    findAndDeleteMessage,
    message.channelId,
    message.id,
    result,
  ])

  const onUpdateMessageSubmit = methods.handleSubmit((data) => {
    try {
      if (
        data.message !== '' &&
        data.message !== undefined &&
        isUserMessageOwner()
      ) {
        onUpdateMessage(message.id, data.message)
        methods.setValue('message', '')
        setEditingMessageId(null)
      }
    } catch (error) {
      console.error('Error updating message:', error)
    }
  })

  const onDeleteMessageSubmit = methods.handleSubmit(() => {
    try {
      if (isUserMessageOwner() || isUserServerOwner()) {
        onDeleteMessage(message.channelId, message.id)
      }
    } catch (error) {
      console.error('Error deleting message')
    }
  })

  const replaceTagEntity = (message: ReactNode): ReactNode => {
    if (!findUserForTag) return message

    const regex =
      /@\$(?:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/gi

    const replaceText = (text: string): ReactNode => {
      const parts: ReactNode[] = []
      let lastIndex = 0

      text.replace(regex, (match, offset) => {
        const user = findUserForTag(match)
        parts.push(text.slice(lastIndex, offset))
        parts.push(
          <span
            key={offset}
            className={
              'bg-violet-300 p-1 rounded ' + (user ? 'cursor-pointer' : '')
            }
            onClick={() => user && onClickTagUser(user)}
          >
            {user ? '@' + user.username : 'undefined user'}
          </span>
        )
        lastIndex = offset + match.length
        return match
      })

      parts.push(text.slice(lastIndex))
      return parts
    }

    const recurseChildren = (node: ReactNode): ReactNode => {
      if (typeof node === 'string') {
        return replaceText(node)
      } else if (React.isValidElement(node)) {
        return React.cloneElement(
          node,
          {},
          React.Children.map(node.props.children, (child) =>
            recurseChildren(child)
          )
        )
      } else if (Array.isArray(node)) {
        return node.map(recurseChildren)
      } else {
        return node
      }
    }

    return recurseChildren(message)
  }

  const onClickTagUser = (user: UserDisplayedEntity) => {
    !selectedTaggedUser ||
    (selectedTaggedUser && selectedTaggedUser.id !== user.id)
      ? setSelectedTaggedUser(user)
      : setSelectedTaggedUser(undefined)
  }

  const replaceMentionChannel = (content: ReactNode): ReactNode => {
    if (!findChannelForTag) return content

    const regex =
      /#\$(?:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/gi

    const replaceText = (text: string): ReactNode => {
      const parts: ReactNode[] = []
      let lastIndex = 0

      text.replace(regex, (match, tag) => {
        const channel = findChannelForTag(match)
        parts.push(text.slice(lastIndex, tag))
        parts.push(
          <span
            key={tag}
            className={
              'bg-violet-300 p-1 rounded ' + (channel ? 'cursor-pointer' : '')
            }
            onClick={() => channel && onClickTagChannel(channel)}
          >
            {/* <DisplayChannelFeature key={channel?.id} channel={channel?} /> */}
            {channel ? '#' + channel.name : 'undefined channel'}
          </span>
        )
        lastIndex = tag + match.length
        return match
      })

      parts.push(text.slice(lastIndex))
      return parts
    }

    const recurseChildren = (children: ReactNode): ReactNode => {
      if (typeof children === 'string') {
        return replaceText(children)
      } else if (React.isValidElement(children)) {
        return React.cloneElement(
          children,
          {},
          React.Children.map(children.props.children, (child) =>
            recurseChildren(child)
          )
        )
      } else if (Array.isArray(children)) {
        return children.map(recurseChildren)
      } else {
        return children
      }
    }
    return recurseChildren(content)
  }

  const onClickTagChannel = (channel: ChannelEntity) => {
    !selectedTaggedChannel ||
    (selectedTaggedChannel && selectedTaggedChannel.id !== channel.id)
      ? navigate(`/servers/${channel.serverId}/channels/${channel.id}`)
      : null
  }

  return (
    <FormProvider {...methods}>
      <Message
        user={user}
        message={message}
        profilePicture={userProfilePicture}
        isEditing={isEditing}
        onDelete={
          isUserMessageOwner() || isUserServerOwner()
            ? onDeleteMessageSubmit
            : null
        }
        switchEditing={isUserMessageOwner() ? switchEditing : null}
        cancelEditing={cancelEditing}
        onUpdateMessage={onUpdateMessageSubmit}
        createdAt={createdAt}
        replaceMentionChannel={replaceMentionChannel}
        replaceTagEntity={replaceTagEntity}
        isHighlighted={message.content.includes('@$' + userId)}
        onPin={onPin}
        isPinned={isPinned}
      />
    </FormProvider>
  )
}
