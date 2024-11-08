import {
  ChannelEntity,
  MessageEntity,
  UserDisplayedEntity,
} from '@beep/contracts'
import {
  Button,
  ButtonStyle,
  DynamicSelector,
  DynamicSelectorProps,
  Icon,
  InputMessageArea,
  Skeleton
} from '@beep/ui'
import { useCallback } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import { TaggedChannelFeature } from '../feature/tagged-channel-feature'
import { UserInformationsFeature } from '../feature/user-informations-feature'
import DisplayPinned from './display-pinned'
import ListMessages from './list-messages'

export interface PageChannelProps {
  messageForm: UseFormReturn<{
    message: string
    replyTo: MessageEntity | null
  }>
  messageListRef: React.RefObject<HTMLDivElement>
  channel?: ChannelEntity
  messages?: MessageEntity[]
  sendMessage: () => void
  onScrollMessage: () => void
  onUpdateMessage: (messageId: string, newContent: string) => void
  onDeleteMessage: (channelId: string, messageId: string) => void
  files: File[]
  onAddFiles: (file: File) => void
  onDeleteFile: (index: number) => void
  filesPreview: { content: string | null }[]
  hideRightDiv?: () => void
  hideLeftDiv?: () => void
  inputRef?: React.RefObject<HTMLTextAreaElement>
  editingMessageId: string | null
  setEditingMessageId: React.Dispatch<React.SetStateAction<string | null>>
  onChange?: (value: string, onChange: (value: string) => void) => void
  onCursorChange?: () => void
  dynamicSelector?: DynamicSelectorProps
  selectedTaggedUser: UserDisplayedEntity | undefined
  setSelectedTaggedUser: React.Dispatch<
    React.SetStateAction<UserDisplayedEntity | undefined>
  >
  selectedTaggedChannel: ChannelEntity | undefined
  setSelectedTaggedChannel: React.Dispatch<
    React.SetStateAction<ChannelEntity | undefined>
  >
  isLoadingMessages: boolean
  isLoadingChannel: boolean
  serverId?: string
}

export const PageChannel = ({
  messageForm,
  channel,
  messages,
  messageListRef,
  onScrollMessage,
  sendMessage,
  onUpdateMessage,
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
  onDeleteMessage,
  dynamicSelector,
  selectedTaggedUser,
  setSelectedTaggedUser,
  selectedTaggedChannel,
  setSelectedTaggedChannel,
  isLoadingMessages,
  isLoadingChannel,
  serverId,
}: PageChannelProps) => {
  const replyTo = messageForm.watch('replyTo')
  const setReplyTo = (message: MessageEntity | null) => {
    messageForm.setValue('replyTo', message)
  }

  const handleKeyDownOnMessage = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.shiftKey) {
        return
      }
      if (event.key === 'Enter') {
        event.preventDefault()
        sendMessage()
      }
    },
    [sendMessage]
  )

  return (
    <div className="bg-violet-200 w-full p-6 flex flex-col gap-6 justify-between h-[100dvh]">
      {/* Message page Header */}

      <div className="flex flex-row justify-between gap-6">
        <div className="flex flex-row gap-6 justify-between w-full">
          <div className="flex flex-row gap-6">
            {/* Button to hide the the left pane and icon to show channel name */}
            <Button
              style={ButtonStyle.SQUARE}
              className="lg:hidden !bg-violet-300"
              onClick={hideLeftDiv}
            >
              <Icon name="lucide:arrow-left" className="w-4 h-4" />
            </Button>
            {channel !== undefined && !isLoadingChannel ? (
              <div className="flex flex-row gap-2 items-center justify-center p-3 bg-violet-300 rounded-xl h-14">
                <Icon name="lucide:hash" className="w-4 h-4" />
                <p className="font-semibold">{channel.name}</p>
              </div>
            ) : (
              <Skeleton className="h-14 w-24 rounded-xl bg-violet-300" />
            )}
          </div>
          {/* Button to display the list of pinned messages of a channel */}
          <div className="flex flex-row gap-6 ">
            {channel?.id !== undefined ? (
              <DisplayPinned
                key={'display_pinned_' + channel?.id}
                channelId={channel?.id ?? ''}
                onUpdateMessage={onUpdateMessage}
                editingMessageId={editingMessageId}
                setEditingMessageId={setEditingMessageId}
                selectedTaggedUser={selectedTaggedUser}
                setSelectedTaggedUser={setSelectedTaggedUser}
              />
            ) : (
              <Skeleton className="h-14 w-44 rounded-xl bg-violet-300" />
            )}
            <Button
              style={ButtonStyle.SQUARE}
              className="lg:hidden !bg-violet-300"
              onClick={hideRightDiv}
            >
              <Icon name="lucide:user" className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Message list */}
      <ListMessages
        messages={messages ?? []}
        isLoading={isLoadingMessages}
        messageListRef={messageListRef}
        onScroll={onScrollMessage}
        onUpdateMessage={onUpdateMessage}
        onDeleteMessage={onDeleteMessage}
        editingMessageId={editingMessageId}
        setEditingMessageId={setEditingMessageId}
        selectedTaggedUser={selectedTaggedUser}
        setSelectedTaggedUser={setSelectedTaggedUser}
        setSelectedTaggedChannel={setSelectedTaggedChannel}
        onReply={setReplyTo}
        serverId={serverId}
      />
      {selectedTaggedChannel ? (
        <TaggedChannelFeature
          channel={selectedTaggedChannel}
          onClick={() => setSelectedTaggedChannel(undefined)}
        />
      ) : null}
      {selectedTaggedUser ? (
        <UserInformationsFeature
          user={{
            id: selectedTaggedUser.id,
            username: selectedTaggedUser.username,
          }}
          onClose={() => setSelectedTaggedUser(undefined)}
        />
      ) : null}
      {/* Message input + bouttons + files */}
      <div className="flex flex-col w-full gap-3">
        {replyTo ? (
          <div
            className="replying-to"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>
              Reply to <strong>{replyTo.owner?.username}</strong> :{' '}
              <em>
                {replyTo.content.length > 15
                  ? `${replyTo.content.substring(0, 15)} ...`
                  : replyTo.content}
              </em>
            </span>
            <button
              onClick={() => setReplyTo(null)}
              style={{ background: 'none', border: 'none' }}
            >
              <Icon name="lucide:x" className="w-4 h-4" />
            </button>
          </div>
        ) : null}

        {/* files */}
        <div className="flex flex-row gap-3 items-end w-full">
          {files.map((file: File, index: number) => {
            return (
              <div
                key={'files' + index}
                className="flex flex-col gap-2 items-center w-[180px] relative"
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
                    alt="file"
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
              control={messageForm.control}
              name="message"
              render={({ field }) => (
                <InputMessageArea
                  type="text"
                  name={'message'}
                  value={field.value}
                  className="rounded-xl bg-violet-50 px-4 w-full"
                  placeholder="Type a message"
                  ref={inputRef}
                  onChange={
                    onChange
                      ? (e) => onChange(e.target.value, field.onChange)
                      : field.onChange
                  }
                  onMouseUp={
                    onCursorChange ? () => onCursorChange() : undefined
                  }
                  onKeyUp={onCursorChange ? () => onCursorChange() : undefined}
                  onKeyDown={handleKeyDownOnMessage}
                />
              )}
            />
          </div>

          {/* buttons */}
          <div className="flex flex-row gap-6">
            <Button
              style={ButtonStyle.SQUARE}
              onClick={() => sendMessage()}
              className="!bg-violet-50"
            >
              <Icon name="lucide:send" className="w-5 h-5" />
            </Button>
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
                if (e.target?.files?.[0]) {
                  onAddFiles(e.target?.files?.[0])
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
