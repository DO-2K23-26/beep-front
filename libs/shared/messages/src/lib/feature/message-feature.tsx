import { useCreateMessageMutation } from '@beep/channel'
import {
  ChannelEntity,
  MemberEntity,
  MessageEntity,
  ServerEntity,
} from '@beep/contracts'
import { messageActions } from '@beep/message'
import { useGetMembersQuery, useGetServerChannelsQuery } from '@beep/server'
import { AppDispatch } from '@beep/store'
import { getUserState, useGetUsersFromQuery } from '@beep/user'
import { skipToken } from '@reduxjs/toolkit/query'
import { createContext, ReactNode, useEffect, useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
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
  onReply?: (message: MessageEntity) => void
  serverId?: string
}

export interface IMessageContext {
  member?: MemberEntity
  server?: ServerEntity
  currentUserIsOwner?: boolean
  message: MessageEntity
  isDisplayedAsPinned?: boolean
  isLoadingCreate?: boolean
  isErrorCreate?: boolean
  isEditing?: boolean
  isHighlighted?: boolean
  messageForm?: UseFormReturn<{
    message: string
  }>
  switchEditing?: () => void
  cancelEditing?: () => void
  retryMessage?: () => void
  replaceUserTag: (message: ReactNode) => ReactNode
  replaceMentionChannel: (content: React.ReactNode) => React.ReactNode
  onReply?: () => void
}

export const MessageContext = createContext<IMessageContext>({
  message: {} as MessageEntity,
  replaceUserTag: (message: ReactNode) => {
    return message
  },
  replaceMentionChannel: (message: ReactNode) => {
    return message
  },
})

export default function MessageFeature({
  message,
  serverId,
  onReply,
  isDisplayedAsPinned,
}: MessageFeatureProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { payload: userPayload } = useSelector(getUserState)
  const { data: members } = useGetMembersQuery(serverId ?? skipToken)

  const currentUserIsOwner = userPayload?.sub === message.ownerId
  const matches = RegExp(regexUserTagging).exec(message.content)
  const taggedUserIds = matches
    ? matches
        .map((match) => match.slice(2))
        .filter(
          (userId) =>
            members && !members.map((member) => member.userId).includes(userId)
        )
    : []
  const { data: taggedUsers } = useGetUsersFromQuery(
    { userIds: taggedUserIds },
    { skip: taggedUserIds.length === 0 }
  )
  const { data: channels } = useGetServerChannelsQuery(serverId ?? skipToken)
  const [createMessage, createResult] = useCreateMessageMutation()
  const [isEditing, setIsEditing] = useState(false)
  const navigate = useNavigate()

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

  const setAsRepliedMessage = () => {
    if (onReply) onReply(message)
  }

  const retryMessage = () => {
    dispatch(
      messageActions.delete(message)
    )
    dispatch(
      messageActions.send({
        channelId: message.channelId,
        files: [], //files arent supported when resending yet
        message: message.content,
        replyTo: message.parentMessage ?? null,
        userId: message.ownerId ?? '',
      })
    )
  }

  const messageForm = useForm({
    mode: 'onChange',
    defaultValues: {
      message: message.content,
    },
  })

  const switchEditing = () => {
    setIsEditing(true)
  }

  const cancelEditing = () => {
    messageForm.resetField('message')
    setIsEditing(false)
  }

  const replaceUserTag = (message: ReactNode): ReactNode => {
    const findUserForTag = (userId: string) => {
      const serverMember =
        members && members.find((member) => member.userId === userId.slice(2))
      if (serverMember)
        return {
          id: serverMember.userId,
          username: serverMember.nickname,
          profilePicture: undefined,
        } as DisplayedEntity

      return taggedUsers?.find(
        (u) => u.id === userId.slice(2)
      ) as DisplayedEntity
    }
    return recurseChildren(
      message,
      regexUserTagging,
      '@',
      findUserForTag,
      () => {
        /*Do nothing for the moment*/
      }
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
    <MessageContext.Provider
      value={{
        message,
        isEditing,
        isLoadingCreate: createResult.isLoading,
        isErrorCreate: createResult.isError,
        currentUserIsOwner,
        messageForm,
        isDisplayedAsPinned,
        isHighlighted:
          message.content.includes('@$' + (userPayload?.sub ?? '')) ||
          message.parentMessage?.ownerId === userPayload?.sub,
        switchEditing,
        onReply: setAsRepliedMessage,
        replaceUserTag,
        retryMessage,
        replaceMentionChannel,
        cancelEditing,
      }}
    >
      <Message />
    </MessageContext.Provider>
  )
}
