import { ChannelEntity, ChannelType, MessageEntity } from '@beep/contracts'
import { Button, ButtonStyle, Icon, Input } from '@beep/ui'
import ListMessages from './list-messages'
import { Controller, useFormContext } from 'react-hook-form'

export type MessageFormValues = {
  content: string
  files: FileList | null
}

export interface PageChannelProps {
  channel: ChannelEntity
  messages: MessageEntity[]
  sendMessage: () => void
  onFiles?: () => void
  hideRightDiv?: () => void
  hideLeftDiv?: () => void
}

export const PageChannel = ({
  channel,
  messages,
  sendMessage,
  onFiles,
  hideRightDiv,
  hideLeftDiv,
}: PageChannelProps) => {
  const { control } = useFormContext()

  const onSend = () => {
    sendMessage();
    control._reset();
  }

  return (
    <div className="bg-violet-200 w-full p-6 flex flex-col gap-6 justify-between h-[100dvh]">
      {/* Message page Header */}
      <div className="flex flex-row justify-between gap-6">
        <div className="flex flex-row gap-6">
          <Button
            style={ButtonStyle.SQUARE}
            className="lg:hidden !bg-violet-300"
            onClick={hideLeftDiv}
          >
            <Icon name="lucide:arrow-left" className="w-4 h-4" />
          </Button>
          <div className="flex flex-row gap-2 items-center justify-center p-3 bg-violet-300 rounded-xl h-14">
            {channel.type === ChannelType.VOICE ? (
              <Icon name="lucide:volume-2" className="w-4 h-4" />
            ) : (
              <Icon name="lucide:hash" className="w-4 h-4" />
            )}
            <p className="font-semibold">{channel.name}</p>
          </div>
        </div>
        <Button
          style={ButtonStyle.SQUARE}
          className="lg:hidden !bg-violet-300"
          onClick={hideRightDiv}
        >
          <Icon name="lucide:user" className="w-4 h-4" />
        </Button>
      </div>
      {/* Message list */}
      <ListMessages messages={messages} />
      {/* Message input + bouttons */}
      <div className="flex flex-col gap-3 font-medium">
        <div className="flex flex-row gap-6 justify-between">
          <Controller
            name='message'
            control={control}
            render={({ field }) => (
              <Input
                type='text'
                name={'message'}
                value={field.value}
                className="rounded-xl bg-violet-50 px-4 h-full w-full"
                placeholder="Type a message"
                onChange={field.onChange}
              />
            )}
          />
          <div className="flex flex-row gap-6">
            <Button
              style={ButtonStyle.SQUARE}
              onClick={onSend}
              className="!bg-violet-50"
            >
              <Icon name="lucide:send" className="w-5 h-5" />
            </Button>
            <Button
              style={ButtonStyle.SQUARE}
              onClick={onFiles}
              className="!bg-violet-50"
            >
              <Icon name="lucide:plus" className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
