import { useGetMessagesByChannelIdQuery } from '@beep/channel'
import {
  MessageEntity
} from '@beep/contracts'
import { useGetMembersQuery } from '@beep/server'
import { RootState } from '@beep/store'
import { skipToken } from '@reduxjs/toolkit/query'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import ListMessages from '../ui/list-messages'

interface ListMessagesFeatureProps {
  setReplyTo: (message: MessageEntity | null) => void
}

export function ListMessagesFeature({ setReplyTo }: ListMessagesFeatureProps) {
  const messageListRef = useRef<HTMLDivElement>(null)
  const { serverId, channelId = '' } = useParams<{
    serverId: string
    channelId: string
  }>()
  const messageState = useSelector(
    (state: RootState) => state.message.channels_messages[channelId]
  )

  const { data: usersServer } = useGetMembersQuery(serverId ?? skipToken)
  const [fetchBeforeId, setFetchBeforeId] = useState<string | null>(null)
  const limit = 50

  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const { isLoading: isLoadingMessages, isFetching: isFetchingMessage } =
    useGetMessagesByChannelIdQuery(
      { channelId, before: fetchBeforeId, limit },
      {
        refetchOnFocus: true,
        skip: channelId === undefined,
        refetchOnMountOrArgChange: true,
      }
    )
  useEffect(() => {
    setFetchBeforeId(null)
  }, [channelId])
  const onScrollMessage = () => {
    if (messageListRef.current && messageState !== undefined) {
      const { scrollTop, scrollHeight, clientHeight } = messageListRef.current

      if (
        ((scrollTop - clientHeight) / scrollHeight) * -1 >= 0.75 &&
        messageState?.[messageState.length - 1] !== undefined &&
        messageState?.length >= limit
      ) {
        setFetchBeforeId(messageState[messageState.length - 1].id ?? null)
      }
    }
  }
  return (
    <ListMessages
      messages={messageState ?? []}
      isLoading={isLoadingMessages || isFetchingMessage}
      messageListRef={messageListRef}
      onReply={setReplyTo}
      onScroll={onScrollMessage}
      editingMessageId={editingMessageId}
      setEditingMessageId={setEditingMessageId}
      serverId={serverId}
      usersServer={usersServer ?? []}
    />
  )
}
