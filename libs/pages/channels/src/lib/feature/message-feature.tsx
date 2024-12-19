import {
  useCreateMessageMutation,
  useDeleteMessageMutation,
  usePinMessageMutation,
  useUpdateMessageMutation,
} from '@beep/channel'
import { ChannelEntity, MemberEntity, MessageEntity } from '@beep/contracts'
import { messageActions } from '@beep/message'
import { useGetMembersQuery, useGetServerChannelsQuery } from '@beep/server'
import { AppDispatch } from '@beep/store'
import { getUserState, useGetUsersFromQuery } from '@beep/user'
import { skipToken } from '@reduxjs/toolkit/query'
import { ReactNode, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
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
  editingMessageId?: string | null
  setEditingMessageId?: (id: string | null) => void
  serverId?: string
}

export default function MessageFeature({
  message,
  serverId,
  onReply,
  isDisplayedAsPinned,
  editingMessageId,
  setEditingMessageId,
}: MessageFeatureProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { payload: userPayload } = useSelector(getUserState)
  const currentUserIsOwner = userPayload?.sub === message.ownerId
  const channelId = message.channelId
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
  const { data: members } = useGetMembersQuery(serverId ?? skipToken)
  const [updateMessage] = useUpdateMessageMutation()
  const [createMessage, createResult] = useCreateMessageMutation()
  const [deleteMessage] = useDeleteMessageMutation()
  const [pinMessage, result] = usePinMessageMutation()
  const navigate = useNavigate()

  const onDeleteMessage = async (channelId: string, messageId: string) => {
    deleteMessage({
      channelId: channelId,
      messageId: messageId,
    })
  }
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

  const { data: channels } = useGetServerChannelsQuery(serverId ?? skipToken)

  const setAsRepliedMessage = () => {
    if (onReply) onReply(message)
  }

  const isEditing = editingMessageId === message.id

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      message: message.content,
    },
  })
  const switchEditing = () => {
    if (
      editingMessageId &&
      editingMessageId !== message.id &&
      setEditingMessageId
    ) {
      setEditingMessageId(null)
    }
    methods.resetField('message')
    if (setEditingMessageId) setEditingMessageId(message.id)
  }

  const cancelEditing = () => {
    methods.resetField('message')
    if (setEditingMessageId) setEditingMessageId(null)
  }

  const onPin = async () => {
    pinMessage({
      channelId: message.channelId,
      messageId: message.id,
      action: message.pinned ? 'unpin' : 'pin',
    })
  }

  const onUpdateMessage = async (messageId: string, newContent: string) => {
    updateMessage({
      channelId: channelId,
      messageId: messageId,
      content: newContent,
    })
  }

  function containsUrl(): boolean {
    return /https?:\/\/[^\s]+/.test(message.content)
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
  }, [message.pinned, result])

  const onUpdateMessageSubmit = methods.handleSubmit((data) => {
    if (
      data.message !== '' &&
      data.message !== undefined &&
      currentUserIsOwner &&
      onUpdateMessage !== undefined
    ) {
      onUpdateMessage(message.id, data.message)
      methods.setValue('message', '')
      if (setEditingMessageId) setEditingMessageId(null)
    }
  })

  const onDeleteMessageSubmit = methods.handleSubmit(() => {
    if (onDeleteMessage) onDeleteMessage(message.channelId, message.id)
  })

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
    <FormProvider {...methods}>
      <Message
        message={createResult.data ?? message}
        isEditing={isEditing}
        isDisplayedAsPinned={isDisplayedAsPinned}
        onDelete={onDeleteMessageSubmit}
        isLoadingCreate={createResult.isLoading}
        switchEditing={currentUserIsOwner ? switchEditing : null}
        cancelEditing={cancelEditing}
        onUpdateMessage={onUpdateMessageSubmit}
        replaceMentionChannel={replaceMentionChannel}
        replaceUserTag={replaceUserTag}
        isHighlighted={
          message.content.includes('@$' + (userPayload?.sub ?? '')) ||
          message.parentMessage?.ownerId === userPayload?.sub
        }
        onPin={onPin}
        onReply={setAsRepliedMessage}
        containsUrl={containsUrl}
      />
    </FormProvider>
  )
}
