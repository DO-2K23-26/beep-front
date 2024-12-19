import { useGetMessagesByChannelIdQuery } from '@beep/channel'
import { MessageEntity } from '@beep/contracts'
import { RootState } from '@beep/store'
import { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import ListMessages from '../ui/list-messages'

interface ListMessagesFeatureProps {
  setReplyTo: (message: MessageEntity | null) => void
}

export function ListMessagesFeature({ setReplyTo }: ListMessagesFeatureProps) {
  const messageListRef = useRef<HTMLDivElement>(null)
  const limit = 50
  const { serverId, channelId = '' } = useParams<{
    serverId: string
    channelId: string
  }>()
  const messageState = useSelector(
    (state: RootState) => state.message.channels_messages[channelId]
  )
  const [fetchBeforeId, setFetchBeforeId] = useState<string | null>(null)
  const { isLoading: isLoadingMessages, isFetching: isFetchingMessage } =
    useGetMessagesByChannelIdQuery(
      { channelId, before: fetchBeforeId, limit },
      {
        refetchOnFocus: true,
        skip: channelId === undefined,
        refetchOnMountOrArgChange: true,
      }
    )
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
      serverId={serverId}
    />
  )
}
