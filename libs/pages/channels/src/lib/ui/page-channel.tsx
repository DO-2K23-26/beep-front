import { ChannelEntity, ChannelType, MessageEntity } from '@beep/contracts'
import { Button, ButtonStyle, Icon, Input } from '@beep/ui'
import { useState } from 'react'
import ListMessages from './list-messages'

export type MessageFormValues = {
  content: string
  files: FileList | null
}

export interface PageChannelProps {
  channel: ChannelEntity
  messages: MessageEntity[]
  onSend?: () => void
  onFiles?: () => void
}

export const PageChannel = ({
  channel,
  messages,
  onSend,
  onFiles,
}: PageChannelProps) => {
  const [isLeftDivVisible, setLeftDivVisible] = useState(false)
  const [isRightDivVisible, setRightDivVisible] = useState(false)

  return (
    <div
      className={
        isLeftDivVisible || isRightDivVisible
          ? 'hidden'
          : 'bg-violet-200 w-full p-6 flex flex-col gap-6 justify-between h-[100dvh]'
      }
    >
      {/* Message page Header */}
      <div className="flex flex-row justify-between gap-6">
        <div className="flex flex-row gap-6">
          {/* <Button onClick={hideLeftDiv}> */}

          <div className="flex flex-row gap-2 items-center justify-center p-3 bg-violet-300 rounded-xl h-14">
            {channel.type === ChannelType.VOICE ? (
              <Icon name="lucide:volume-2" className="w-4 h-4" />
            ) : (
              <Icon name="lucide:hash" className="w-4 h-4" />
            )}
            <p className="font-semibold">{channel.name}</p>
          </div>
        </div>
        {/* <Button onClick={hideRightDiv} className="!bg-violet-300 lg:hidden"> */}
        <Button className="!p-0 !min-w-0 !outline-none !h-14 !w-14 !bg-violet-300 lg:hidden">
          <Icon name="lucide:user" className="!bg-violet-300 w-4 h-4" />
        </Button>
      </div>
      {/* Message list */}
      <ListMessages messages={messages} />
      {/* Message input + bouttons */}
      <div className="flex flex-col gap-3 font-medium">
        {/* <p>dorian is typing...</p> */}
        <div className="flex flex-row gap-6 justify-between">
          <Input
            className="rounded-xl bg-violet-50 px-4 h-full w-full"
            placeholder="Type a message"
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
