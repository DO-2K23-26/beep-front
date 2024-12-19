import { useUpdateMessageMutation } from '@beep/channel'
import { Button, ButtonStyle, Icon, InputMessageArea } from '@beep/ui'
import { useContext, useEffect } from 'react'
import { Controller } from 'react-hook-form'
import { MessageContext } from '../feature/message-feature'

export function UpdateMessageInput() {
  const { message, isEditing, messageForm, cancelEditing } =
    useContext(MessageContext)

  const [updateMessage] = useUpdateMessageMutation()

  const onUpdateMessage = messageForm?.handleSubmit((formState) => {
    updateMessage({
      channelId: message.channelId,
      messageId: message.id,
      content: formState.message,
    })
  })

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && cancelEditing) {
        cancelEditing()
      } else if (
        event.key === 'Enter' &&
        !event.shiftKey &&
        onUpdateMessage &&
        cancelEditing
      ) {
        event.preventDefault()
        onUpdateMessage()
        cancelEditing()
      }
    }

    if (isEditing) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  })
  return (
    <div className="flex flex-row justify-between items-center gap-3 w-full">
      <Controller
        name="message"
        control={messageForm?.control}
        defaultValue={message.content || ''}
        render={({ field }) => (
          <div className="flex flex-row justify-between items-center gap-5 w-full">
            <InputMessageArea
              {...field}
              type="text"
              className="rounded-xl bg-violet-50 px-4 flex-grow w-full"
            />
            <Button style={ButtonStyle.NONE} onClick={onUpdateMessage}>
              <Icon name="lucide:save" className="w-10 h-10 visible" />
            </Button>
          </div>
        )}
      />
    </div>
  )
}
