import React, { useState } from 'react'
import { Button, ButtonSize } from '@beep/ui'
import PinnedMessagesList from './pinned-messages-list'
import { useFetchPinnedMessagesQuery } from '@beep/channel'
import { UserDisplayedEntity } from '@beep/contracts'

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
  const [showPinnedMessages, setShowPinnedMessages] = useState<boolean>(false)
  const { data: messages } = useFetchPinnedMessagesQuery(channelId)

  return (
    <div className="relative">
      <Button
        iconLeft={'lucide:pin'}
        size={ButtonSize.REGULAR}
        className="flex flex-row gap-2 items-center justify-center p-3 bg-violet-300 rounded-xl !h-14"
        onClick={() => setShowPinnedMessages(!showPinnedMessages)}
      >
        <p>Pinned messages</p>
      </Button>
      {showPinnedMessages && messages && (
        <PinnedMessagesList
          messages={messages}
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
