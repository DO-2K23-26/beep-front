import {
  ChannelEntity,
  MemberEntity,
  MessageEntity,
  UserDisplayedEntity,
} from '@beep/contracts'
import { DynamicSelector, DynamicSelectorProps, Icon } from '@beep/ui'
import { useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { TaggedChannelFeature } from '../feature/tagged-channel-feature'
import { UserInformationsFeature } from '../feature/user-informations-feature'
import { InputChannelArea } from './input-channel-area'
import ListMessages from './list-messages'

export interface PageChannelProps {
  messageForm: UseFormReturn<{
    message: string
    replyTo: MessageEntity | null
  }>
  messageListRef: React.RefObject<HTMLDivElement>
  messages?: MessageEntity[]
  sendMessage: () => void
  onScrollMessage: () => void
  onUpdateMessage: (messageId: string, newContent: string) => void
  onDeleteMessage: (channelId: string, messageId: string) => void
  files: File[]
  onAddFiles: (file: File) => void
  onDeleteFile: (index: number) => void
  filesPreview: { content: string | null }[]
  inputRef?: React.RefObject<HTMLTextAreaElement>
  usersServer: MemberEntity[]
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
  serverId?: string
  onFocusChannel: () => void
}

export const PageChannel = ({
  messageForm,
  messages,
  messageListRef,
  onScrollMessage,
  sendMessage,
  onUpdateMessage,
  files,
  onAddFiles,
  onDeleteFile,
  filesPreview,
  inputRef,
  usersServer,
  editingMessageId,
  setEditingMessageId,
  onChange,
  onFocusChannel,
  onCursorChange,
  onDeleteMessage,
  dynamicSelector,
  selectedTaggedUser,
  setSelectedTaggedUser,
  selectedTaggedChannel,
  setSelectedTaggedChannel,
  isLoadingMessages,
  serverId,
}: PageChannelProps) => {
  const { t } = useTranslation()

  const replyTo = messageForm.watch('replyTo')
  const setReplyTo = (message: MessageEntity | null) => {
    messageForm.setValue('replyTo', message)
    //focus on input
    if (inputRef?.current) {
      inputRef.current.focus()
    }
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
    <>
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
        usersServer={usersServer}
      />
      <div onClick={onFocusChannel}>
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
        <div className="flex flex-col w-full gap-3 ">
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
                {t('channels.page-channel.reply_to')}{' '}
                <strong>{replyTo.owner?.username}</strong> :{' '}
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
          )}

          {/* files */}
          {files.length !== 0 && (
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
                    {filesPreview.length > index &&
                    filesPreview[index].content ? (
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
          )}
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
          <InputChannelArea
            onAddFiles={onAddFiles}
            sendMessage={sendMessage}
            inputRef={inputRef}
            onChange={onChange}
            messageForm={messageForm}
            handleKeyDownOnMessage={handleKeyDownOnMessage}
            onCursorChange={onCursorChange}
          />
        </div>
      </div>
    </>
  )
}
