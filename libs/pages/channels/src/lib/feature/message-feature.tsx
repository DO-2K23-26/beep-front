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
import {
  getUserState,
  useFetchProfilePictureQuery,
  useGetUsersFromQuery,
} from '@beep/user'
import React, { ReactNode, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Message from '../ui/message'

interface MessageFeatureProps {
  message: MessageEntity
  user?: UserEntity
  createdAt: string
  onUpdateMessage: (messageId: string, newContent: string) => void
  onDeleteMessage: (channelId: string, messageId: string) => void
  editingMessageId: string | null
  setEditingMessageId: (id: string | null) => void
  isPinned: boolean
  onReply: (message: MessageEntity) => void
  selectedTaggedUser: UserDisplayedEntity | undefined
  setSelectedTaggedUser: React.Dispatch<
    React.SetStateAction<UserDisplayedEntity | undefined>
  >
  findChannelForTag: (tag: string) => ChannelEntity | undefined
  selectedTaggedChannel: ChannelEntity | undefined
  setSelectedTaggedChannel?: React.Dispatch<
    React.SetStateAction<ChannelEntity | undefined>
  >
}

export default function MessageFeature({
  message,
  user,
  createdAt,
  onUpdateMessage,
  onDeleteMessage,
  editingMessageId,
  setEditingMessageId,
  isPinned,
  onReply,
  selectedTaggedUser,
  setSelectedTaggedUser,
  findChannelForTag,
  selectedTaggedChannel,
}: MessageFeatureProps) {
  const [pinMessage, result] = usePinMessageMutation()
  const [createMessage] = useCreateMessageMutation()
  const [findAndDeleteMessage] = useFindAndDeleteMessageMutation()
  const serverData = useSelector(getServersState)
  const userId: string | undefined = useSelector(getUserState).payload?.sub
  const navigate = useNavigate()
  const userProfilePicture = useFetchProfilePictureQuery(
    user?.id ?? ''
  ).currentData
  const regex =
    /@\$[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi
  const matches = message.content.match(regex) || []
  const ids = matches.map((match) => match.slice(2))
  const { data: taggedUsers } = useGetUsersFromQuery({ userIds: ids })

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
      //TODO: Handle error
    }
  })

  const onDeleteMessageSubmit = methods.handleSubmit(() => {
    try {
      if (isUserMessageOwner() || isUserServerOwner()) {
        onDeleteMessage(message.channelId, message.id)
      }
    } catch (error) {
      //TODO: Handle error
    }
  })

  const replaceTagEntity = (message: ReactNode): ReactNode => {
    if (!taggedUsers) return message
    const replaceText = (text: string): ReactNode => {
      const parts: ReactNode[] = []
      let lastIndex = 0

      text.replace(regex, (match, offset) => {
        const user = taggedUsers.find((u) => u.id === match.slice(2))
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
    const regex =
      /#\$[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi

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
    if (selectedTaggedChannel && selectedTaggedChannel.id !== channel.id)
      navigate(`/servers/${channel.serverId}/channels/${channel.id}`)
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
        onReply={() => onReply(message)}
      />
    </FormProvider>
  )
}
