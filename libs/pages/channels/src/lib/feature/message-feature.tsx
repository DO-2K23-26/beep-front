import { usePinMessageMutation } from '@beep/channel'
import {
  ChannelEntity,
  MessageEntity,
  UserDisplayedEntity,
} from '@beep/contracts'
import { getServersState } from '@beep/server'
import {
  getUserState,
  useFetchProfilePictureQuery,
  useGetUsersFromQuery,
} from '@beep/user'
import React, { ReactNode, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Message from '../ui/message'
import toast from 'react-hot-toast'
import { recurseChildren, regexUserTagging } from '../utils/tagging-utils'
import { Tag } from '../ui/tag'

interface MessageFeatureProps {
  message: MessageEntity
  isDisplayedAsPinned?: boolean
  onUpdateMessage: (messageId: string, newContent: string) => void
  onDeleteMessage: (channelId: string, messageId: string) => void
  editingMessageId: string | null
  setEditingMessageId: (id: string | null) => void
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
  onUpdateMessage,
  onDeleteMessage,
  isDisplayedAsPinned,
  editingMessageId,
  setEditingMessageId,
  onReply,
  selectedTaggedUser,
  setSelectedTaggedUser,
  findChannelForTag,
  selectedTaggedChannel,
}: MessageFeatureProps) {
  const [pinMessage, result] = usePinMessageMutation()
  const serverData = useSelector(getServersState)
  const userId: string | undefined = useSelector(getUserState).payload?.sub
  const navigate = useNavigate()
  const { data: owner } = useGetUsersFromQuery({ userIds: [message.ownerId] })
  const { currentData: userProfilePicture } = useFetchProfilePictureQuery(
    message.ownerId
  )

  const matches = RegExp(regexUserTagging).exec(message.content) || []
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
    await pinMessage({
      channelId: message.channelId,
      messageId: message.id,
      action: message.pinned ? 'unpin' : 'pin',
    })
  }

  function isUserMessageOwner(): boolean {
    if (userId) return userId === message.ownerId
    return false
  }

  function isUserServerOwner(): boolean {
    if (userId) return userId === serverData.server?.ownerId
    return false
  }

  useEffect(() => {
    const pinning = message.pinned ? 'unpin' : 'pin'
    if (result.error) {
      toast.error(
        `Failure while trying to ${pinning}
         the message`
      )
    } else if (result.isSuccess) {
      toast.success(`Message ${pinning}!`)
    }
  }, [result])

  const onUpdateMessageSubmit = methods.handleSubmit((data) => {
    if (
      data.message !== '' &&
      data.message !== undefined &&
      isUserMessageOwner()
    ) {
      onUpdateMessage(message.id, data.message)
      methods.setValue('message', '')
      setEditingMessageId(null)
    }
  })

  const onDeleteMessageSubmit = methods.handleSubmit(() => {
    if (isUserMessageOwner() || isUserServerOwner()) {
      onDeleteMessage(message.channelId, message.id)
    }
  })

  const onClickTagUser = (user: UserDisplayedEntity) => {
    !selectedTaggedUser ||
    (selectedTaggedUser && selectedTaggedUser.id !== user.id)
      ? setSelectedTaggedUser(user)
      : setSelectedTaggedUser(undefined)
  }

  const replaceTagEntity = (message: ReactNode): ReactNode => {
    if (!taggedUsers) return message

    return recurseChildren(message)
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
            {channel ? '#' + channel.name : 'undefined channel'}
          </span>
        )
        lastIndex = tag + match.length
        return match
      })

      parts.push(text.slice(lastIndex))
      return parts
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
        message={message}
        profilePicture={userProfilePicture}
        isEditing={isEditing}
        isDisplayedAsPinned={isDisplayedAsPinned}
        ownerEntity={owner?.[0]}
        onDelete={
          isUserMessageOwner() || isUserServerOwner()
            ? onDeleteMessageSubmit
            : null
        }
        switchEditing={isUserMessageOwner() ? switchEditing : null}
        cancelEditing={cancelEditing}
        onUpdateMessage={onUpdateMessageSubmit}
        replaceMentionChannel={replaceMentionChannel}
        replaceTagEntity={replaceTagEntity}
        isHighlighted={message.content.includes('@$' + userId)}
        onPin={onPin}
        onReply={() => onReply(message)}
      />
    </FormProvider>
  )
}
