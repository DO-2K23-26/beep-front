import {
  useCreateMessageMutation,
  useGetOneMessageQuery,
  usePinMessageMutation,
} from '@beep/channel'
import {
  ChannelEntity,
  MessageEntity,
  UserDisplayedEntity,
} from '@beep/contracts'
import { messageActions } from '@beep/message'
import { getServersState, useGetServerChannelsQuery } from '@beep/server'
import { AppDispatch } from '@beep/store'
import {
  getUserState,
  useFetchProfilePictureQuery,
  useGetUsersFromQuery,
} from '@beep/user'
import { skipToken } from '@reduxjs/toolkit/query'
import React, { ReactNode, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Message from '../ui/message'
import {
  DisplayedEntity,
  recurseChildren,
  regexChannelTagging,
  regexUserTagging,
} from '../utils/tagging-utils'

interface MessageFeatureProps {
  message: MessageEntity
  isDisplayedAsPinned?: boolean
  onUpdateMessage?: (messageId: string, newContent: string) => void
  onDeleteMessage?: (channelId: string, messageId: string) => void
  editingMessageId: string | null
  setEditingMessageId: (id: string | null) => void
  onReply?: (message: MessageEntity) => void
  selectedTaggedUser: UserDisplayedEntity | undefined
  setSelectedTaggedUser: React.Dispatch<
    React.SetStateAction<UserDisplayedEntity | undefined>
  >
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
}: MessageFeatureProps) {
  const [replyToMessage, setReplyToMessage] = useState<
    MessageEntity | undefined | null
  >(message.parentMessage)
  const { data: replyMessage, isLoading: isLoadingReplyMessage } =
    useGetOneMessageQuery(
      {
        channelId: message.channelId,
        messageId: message.parentMessageId ?? '',
      },
      {
        skip:
          !message.parentMessageId ||
          (message.parentMessage !== undefined &&
            message.parentMessage !== null),
      }
    )
  const [createMessage, createResult] = useCreateMessageMutation()
  const dispatch = useDispatch<AppDispatch>()
  // This is ignored if the message come from the server
  // In the case the message is sent by the current client it will be true
  // when the message is post correctly
  useEffect(() => {
    if (message.isSentByCurrentClient && message.request !== undefined) {
      dispatch(messageActions.removeRequest(message))
      createMessage(message.request)
    }
  }, [createMessage, dispatch, message])

  useEffect(() => {
    if (createResult?.data && message.isSentByCurrentClient)
      dispatch(
        messageActions.replaceFromServer({
          messageId: message.id,
          message: createResult.data,
        })
      )
  }, [createResult, dispatch, message.id, message.isSentByCurrentClient])
  const [pinMessage, result] = usePinMessageMutation()
  const serverData = useSelector(getServersState)
  const userId: string | undefined = useSelector(getUserState).payload?.sub
  const navigate = useNavigate()
  const { serverId } = useParams<{
    serverId: string
  }>()
  const { data: channels } = useGetServerChannelsQuery(serverId ?? skipToken)
  const { data: owner } = useGetUsersFromQuery({ userIds: [message.ownerId] })
  const { currentData: userProfilePicture } = useFetchProfilePictureQuery(
    message.ownerId
  )

  const matches = RegExp(regexUserTagging).exec(message.content) || []
  const ids = matches.map((match) => match.slice(2))
  const { data: taggedUsers } = useGetUsersFromQuery({ userIds: ids })

  const isEditing = editingMessageId === message.id

  useEffect(() => {
    if (replyMessage !== undefined && !isLoadingReplyMessage) {
      setReplyToMessage(replyMessage)
    }
  }, [replyMessage, isLoadingReplyMessage])

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
    const pinning = message.pinned ? 'pin' : 'unpin'
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
      isUserMessageOwner() &&
      onUpdateMessage !== undefined
    ) {
      onUpdateMessage(message.id, data.message)
      methods.setValue('message', '')
      setEditingMessageId(null)
    }
  })

  const onDeleteMessageSubmit = methods.handleSubmit(() => {
    if (
      (isUserMessageOwner() || isUserServerOwner()) &&
      onDeleteMessage !== undefined
    ) {
      onDeleteMessage(message.channelId, message.id)
    }
  })

  const onClickTagUser = (user: DisplayedEntity) => {
    !selectedTaggedUser ||
    (selectedTaggedUser && selectedTaggedUser.id !== user.id)
      ? setSelectedTaggedUser(user as UserDisplayedEntity)
      : setSelectedTaggedUser(undefined)
  }

  const replaceTagEntity = (message: ReactNode): ReactNode => {
    if (!taggedUsers) return message
    const findUserForTag = (userId: string) =>
      taggedUsers.find((u) => u.id === userId.slice(2)) as DisplayedEntity
    return recurseChildren(
      message,
      regexUserTagging,
      '@',
      findUserForTag,
      onClickTagUser
    )
  }

  const replaceMentionChannel = (content: ReactNode): ReactNode => {
    const findChannelForTag = (tag: string): ChannelEntity | undefined => {
      if (channels) {
        return channels.textChannels.find((c) => c.id === tag.slice(2))
      }
      return undefined
    }
    return recurseChildren(
      content,
      regexChannelTagging,
      '#',
      findChannelForTag as (entity: string) => DisplayedEntity,
      onClickTagChannel
    )
  }

  const onClickTagChannel = (channel: DisplayedEntity) => {
    navigate(
      `/servers/${(channel as ChannelEntity).serverId}/channels/${channel.id}`
    )
  }

  return (
    <FormProvider {...methods}>
      <Message
        message={createResult.data ?? message}
        replyTo={replyToMessage}
        profilePicture={userProfilePicture}
        isEditing={isEditing}
        isDisplayedAsPinned={isDisplayedAsPinned}
        ownerEntity={owner?.[0]}
        onDelete={
          (isUserMessageOwner() || isUserServerOwner()) &&
          onDeleteMessage !== undefined
            ? onDeleteMessageSubmit
            : null
        }
        isLoadingCreate={createResult.isLoading}
        switchEditing={isUserMessageOwner() ? switchEditing : null}
        cancelEditing={cancelEditing}
        onUpdateMessage={onUpdateMessage ? onUpdateMessageSubmit : null}
        replaceMentionChannel={replaceMentionChannel}
        replaceTagEntity={replaceTagEntity}
        isHighlighted={message.content.includes('@$' + userId)}
        onPin={onPin}
        onReply={onReply !== undefined ? () => onReply(message) : null}
      />
    </FormProvider>
  )
}
