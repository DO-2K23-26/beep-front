import { ChannelEntity, ChannelType, MessageEntity } from '@beep/contracts'
import { Button, ButtonStyle, Icon, Input } from '@beep/ui'
import ListMessages from './list-messages'
import { Controller, useFormContext } from 'react-hook-form'
import { Dispatch, SetStateAction, useState } from 'react'

export type MessageFormValues = {
  content: string
  files: FileList | null
}

export interface PageChannelProps {
  channel: ChannelEntity
  messages: MessageEntity[]
  sendMessage: () => void
  onUpdateMessage: (messageId: string) => void
  files: File[]
  onAddFiles: (file: File) => void
  onDeleteFile: (index: number) => void
  filesPreview: { content: string | null }[]
  hideRightDiv?: () => void
  hideLeftDiv?: () => void
}

export const PageChannel = ({
  channel,
  messages,
  sendMessage,
  onUpdateMessage,
  files,
  onAddFiles,
  onDeleteFile,
  filesPreview,
  hideRightDiv,
  hideLeftDiv,
}: PageChannelProps) => {
  const { control } = useFormContext()

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
      <ListMessages messages={messages} onUpdateMessage={onUpdateMessage} control={control} />
      {/* Message input + bouttons + files */}
      <div className='flex flex-col w-full gap-3'>
        {/* files */}
        <div className='flex flex-row gap-3 items-start w-full'>
          {files.map((file: File, index: number) => {
            return (
              <div key={index} className="flex flex-col gap-2 items-center relative w-[180px] relative">
                <div className='grid grid-cols-[1fr_20px] gap-2 w-[180px]'>
                  <p className='text-ellipsis overflow-hidden w-[140px]'>{file.name}</p>
                  <div onClick={() => onDeleteFile(index)}><Icon name="lucide:trash-2" className="w-5 h-5 cursor-pointer" /></div>
                </div>
                <img className='h-[180px] w-[180px] object-cover rounded' src={filesPreview.length > index ? (filesPreview[index].content ?? undefined) : undefined} />
              </div>
            )
          })}
        </div>
        {/* bottom input + text */}
        <div className="flex flex-row gap-6 justify-between w-full items-end font-medium">
          {/* text input */}
          <div className='w-full h-full'>
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
                  onKeyDown={(e: any) => e.key === 'Enter' ? sendMessage() : {}}
                />
              )}
            />
          </div>
          
          {/* buttons */}
          <div className="flex flex-row gap-6">
            <Button
              style={ButtonStyle.SQUARE}
              onClick={sendMessage}
              className="!bg-violet-50"
            >
              <Icon name="lucide:send" className="w-5 h-5" />
            </Button>
            {/* <Button
              style={ButtonStyle.SQUARE}
              onClick={onFiles}
              className="!bg-violet-50"
            >
              <Icon name="lucide:plus" className="w-5 h-5" />
            </Button> */}
            <label htmlFor="file_upload" className="cursor-pointer btn btn--regular btn--square !bg-violet-50">
              <Icon name="lucide:plus" className="w-5 h-5" />
            </label>
            <input
            id='file_upload'
            type='file'
            className='hidden'
            onChange={(e) => {
              console.log(e.target?.files)
              onAddFiles(e.target?.files![0])
            }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
