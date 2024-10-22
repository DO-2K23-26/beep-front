import { ChannelEntity, ChannelType, MessageEntity, UserDisplayedEntity } from '@beep/contracts'
import { Button, ButtonStyle, DynamicSelector, DynamicSelectorProps, Icon, Input } from '@beep/ui'
import { Controller, useFormContext } from 'react-hook-form'
import ListMessages from './list-messages'
import DisplayPinned from './display-pinned'
import { useEffect, useState } from 'react'
import { UserInformationsFeature } from '../feature/user-informations-feature'
import { TaggedChannelFeature } from '../feature/tagged-channel-feature'

export type MessageFormValues = {
  content: string
  files: FileList | null
}

export interface PageChannelProps {
  channel: ChannelEntity
  messages: MessageEntity[]
  sendMessage: (content: string, parentMessageId: string | null) => void // Ajout de parentMessageId
  onUpdateMessage: (messageId: string, newContent: string) => void
  onDeleteMessage: (channelId: string, messageId: string) => void
  files: File[]
  onAddFiles: (file: File) => void
  onDeleteFile: (index: number) => void
  filesPreview: { content: string | null }[]
  hideRightDiv?: () => void
  hideLeftDiv?: () => void
  inputRef?: React.RefObject<HTMLInputElement>
  editingMessageId: string | null
  setEditingMessageId: React.Dispatch<React.SetStateAction<string | null>>
  onChange?: (value: string, onChange: (value: string) => void) => void
  onCursorChange?: () => void
  dynamicSelector?: DynamicSelectorProps
  findUserForTag: (value: string) => UserDisplayedEntity | undefined
  selectedTaggedUser: UserDisplayedEntity | undefined
  setSelectedTaggedUser: React.Dispatch<React.SetStateAction<UserDisplayedEntity | undefined>>
  findChannelForTag: (value: string) => ChannelEntity | undefined
  selectedTaggedChannel: ChannelEntity | undefined
  setSelectedTaggedChannel: React.Dispatch<React.SetStateAction<ChannelEntity | undefined>>
}

export const PageChannel = ({
  channel,
  messages,
  sendMessage,
  onUpdateMessage,
  onDeleteMessage,
  files,
  onAddFiles,
  onDeleteFile,
  filesPreview,
  hideRightDiv,
  hideLeftDiv,
  inputRef,
  editingMessageId,
  setEditingMessageId,
  onChange,
  onCursorChange,
  dynamicSelector,
  findUserForTag,
  selectedTaggedUser,
  setSelectedTaggedUser,
  findChannelForTag,
  selectedTaggedChannel,
  setSelectedTaggedChannel,
}: PageChannelProps) => {
  const { control, setValue } = useFormContext()
  const [replyTo, setReplyTo] = useState<MessageEntity | null>(null) // Ajout de l'état replyTo

  const handleSendMessage = (content: string) => {
    sendMessage(content, replyTo ? replyTo.id : null)
    setReplyTo(null) // Réinitialiser replyTo après l'envoi du message
  }


  useEffect(() => {
    if (replyTo) {
      setValue('replyTo', replyTo.id)
    }
  }, [replyTo])

  return (
    <div className="bg-violet-200 w-full p-6 flex flex-col gap-6 justify-between h-[100dvh]">
      {/* Message page Header */}
      <div className="flex flex-row justify-between gap-6">
        <div className="flex flex-row gap-6 justify-between lg:w-full">
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
          <DisplayPinned channelId={channel.id} onUpdateMessage={onUpdateMessage} editingMessageId={editingMessageId} setEditingMessageId={setEditingMessageId} findUserForTag={findUserForTag} selectedTaggedUser={selectedTaggedUser} setSelectedTaggedUser={setSelectedTaggedUser} />
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
      <ListMessages messages={messages} onUpdateMessage={onUpdateMessage} onDeleteMessage={onDeleteMessage} editingMessageId={editingMessageId} setEditingMessageId={setEditingMessageId} findUserForTag={findUserForTag} selectedTaggedUser={selectedTaggedUser} setSelectedTaggedUser={setSelectedTaggedUser} findChannelForTag={findChannelForTag} selectedTaggedChannel={selectedTaggedChannel} setSelectedTaggedChannel={setSelectedTaggedChannel} onReply={setReplyTo}/>
      {

          selectedTaggedChannel ? (
              <TaggedChannelFeature channel={selectedTaggedChannel} onClick={() => setSelectedTaggedChannel(undefined)}/>
          ) : (
            <></>
          )
      }
      {
          selectedTaggedUser ? (
            <UserInformationsFeature user={{ id: selectedTaggedUser.id, username: selectedTaggedUser.username }} onClose={() => setSelectedTaggedUser(undefined)} />
          ) : (
          <></>
        )
      }
      {/* Message input + bouttons + files */}
      <div className="flex flex-col w-full gap-3">
        {replyTo && (
          <div
            className="replying-to"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>
              Répondre à <strong>{replyTo.owner?.username}</strong> :{' '}
              <em>{replyTo.content.length > 15 ? `${replyTo.content.substring(0, 15)} ...` : replyTo.content}</em>
            </span>
            <button
              onClick={() => setReplyTo(null)}
              style={{ background: 'none', border: 'none' }}
            >
              <Icon name="lucide:x" className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* files */}
        <div className="flex flex-row gap-3 items-end w-full">
          {files.map((file: File, index: number) => {
            return (
              <div
                key={index}
                className="flex flex-col gap-2 items-center relative w-[180px] relative"
              >
                <div className="grid grid-cols-[1fr_16px] items-end gap-2 w-[180px]">
                  <p className="truncate overflow-hidden w-[140px]">
                    {file.name}
                  </p>
                  <div onClick={() => onDeleteFile(index)}>
                    <Icon
                      name="lucide:trash-2"
                      className="w-5 h-5 cursor-pointer"
                    />
                  </div>
                </div>
                {filesPreview.length > index && filesPreview[index].content ? (
                  <img
                    className="h-[180px] w-[180px] object-cover rounded"
                    src={filesPreview[index].content ?? undefined}
                  />
                ) : (
                  <div className="h-[180px] w-[180px] bg-violet-600 rounded flex justify-center items-center">
                    <Icon name="lucide:file-text" className="w-10 h-10" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
        {/* dynamic selector to tag users and channels */}
        {dynamicSelector && (
          <DynamicSelector
            title={dynamicSelector.title}
            elements={dynamicSelector.elements}
            maxElements={5}
            emptyMessage={dynamicSelector.emptyMessage}
            onSelect={dynamicSelector.onSelect}
          />
        )}
        {/* bottom input + text */}
        <div className="flex flex-row gap-6 justify-between w-full items-end font-medium">
          {/* text input */}
          <div className="w-full h-full">
            <Controller
              name="message"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  name={'message'}
                  value={field.value}
                  className="rounded-xl bg-violet-50 px-4 h-full w-full"
                  placeholder="Type a message"
                  ref={inputRef}
                  onChange={
                    onChange
                      ? (e) => onChange(e.target.value, field.onChange)
                      : field.onChange
                  }
                  onMouseUp={
                    onCursorChange ? (e) => onCursorChange() : undefined
                  }
                  onKeyUp={onCursorChange ? (e) => onCursorChange() : undefined}
                  onKeyDown={(e: any) =>
                    e.key === 'Enter' ? handleSendMessage(field.value) : {}
                  }
                />
              )}
            />
          </div>

          {/* buttons */}
          <div className="flex flex-row gap-6">
            <Button
              style={ButtonStyle.SQUARE}
              onClick={() => handleSendMessage('')}
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
            <label
              htmlFor="file"
              className="cursor-pointer btn btn--regular btn--square !bg-violet-50"
            >
              <Icon name="lucide:plus" className="w-5 h-5" />
            </label>
            <input
              id="file"
              type="file"
              className="hidden"
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
