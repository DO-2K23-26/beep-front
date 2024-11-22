import { useFetchPinnedMessagesQuery } from '@beep/channel'
import { UserDisplayedEntity } from '@beep/contracts'
import { Button, ButtonSize } from '@beep/ui'
import React, { useState } from 'react'
import PinnedMessagesList from './pinned-messages-list'
import { useTranslation } from 'react-i18next'

interface DisplayPinnedProps {
  channelId: string
  onUpdateMessage: (messageId: string, newContent: string) => void
  editingMessageId: string | null
  setEditingMessageId: (id: string | null) => void
  selectedTaggedUser: UserDisplayedEntity | undefined
  setSelectedTaggedUser: React.Dispatch<
    React.SetStateAction<UserDisplayedEntity | undefined>
  >
}

const DisplayPinned: React.FC<DisplayPinnedProps> = ({
  channelId,
  onUpdateMessage,
  editingMessageId,
  setEditingMessageId,
  selectedTaggedUser,
  setSelectedTaggedUser,
}) => {
  const { t } = useTranslation()

  const { data: pinnedMessage, isLoading: isLoadingPinned } =
    useFetchPinnedMessagesQuery({
      channelId,
    })
  const [showPinnedMessages, setShowPinnedMessages] = useState<boolean>(false)
  return (
    <div className="relative">
      <Button
        iconLeft={'lucide:pin'}
        size={ButtonSize.REGULAR}
        className="flex flex-row gap-2 items-center justify-center p-3 bg-violet-300 rounded-xl !h-14"
        onClick={() => setShowPinnedMessages(!showPinnedMessages)}
      >
        <p>{t('channels.display-pinned.pinned_messages')}</p>
      </Button>
      {showPinnedMessages &&
        !isLoadingPinned &&
        pinnedMessage !== undefined && (
          <PinnedMessagesList
            messages={pinnedMessage}
            onUpdateMessage={onUpdateMessage}
            editingMessageId={editingMessageId}
            setEditingMessageId={setEditingMessageId}
            selectedTaggedUser={selectedTaggedUser}
            setSelectedTaggedUser={setSelectedTaggedUser}
          />
        )}
    </div>
  )
}

export default DisplayPinned
