import { useFetchPinnedMessagesQuery } from '@beep/channel'
import { Button, ButtonSize, Skeleton } from '@beep/ui'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import PinnedMessagesList from './pinned-messages-list'

interface DisplayPinnedProps {
  channelId: string
  isLoading: boolean
}

function DisplayPinned({ channelId, isLoading }: DisplayPinnedProps) {
  const { t } = useTranslation()
  const { data: pinnedMessage, isLoading: isLoadingPinned } =
    useFetchPinnedMessagesQuery({
      channelId,
    }, { skip: channelId === '' })
  const [showPinnedMessages, setShowPinnedMessages] = useState<boolean>(false)
  if (isLoading)
    return <Skeleton className="h-14 w-24 rounded-xl bg-violet-300" />
  return (
    <div>
      <Button
        iconLeft={'lucide:pin'}
        size={ButtonSize.REGULAR}
        className="rounded-xl !h-14 "
        onClick={() => setShowPinnedMessages(!showPinnedMessages)}
      >
        <p>{t('channels.display-pinned.pinned_messages')}</p>
      </Button>
      {showPinnedMessages &&
        !isLoadingPinned &&
        pinnedMessage !== undefined && (
          <PinnedMessagesList messages={pinnedMessage} />
        )}
    </div>
  )
}

export default DisplayPinned
