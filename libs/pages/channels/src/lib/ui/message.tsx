import { MessageEntity, UserEntity } from '@beep/contracts'
import { Button, ButtonStyle, Icon, InputMessageArea } from '@beep/ui'
import { cn } from '@beep/utils'
import Markdoc from '@markdoc/markdoc'
import { DateTime } from 'luxon'
import React, { ReactNode, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import AttachmentFeature from '../feature/attachment-feature'
import { config, markdownComponents } from '../utils/markdown-config'
import { preprocessMarkdown } from '../utils/markdown-parser'

interface MessageProps {
  message: MessageEntity
  replyTo?: MessageEntity | null
  displayedUsername: string
  isEditing: boolean
  profilePicture?: string
  isDisplayedAsPinned?: boolean
  isLoadingCreate: boolean | null
  switchEditing: (() => void) | null
  onUpdateMessage: (() => void) | null
  onDelete: (() => void) | null
  cancelEditing: () => void
  onPin: () => void
  replaceTagEntity: (message: ReactNode) => ReactNode
  replaceMentionChannel: (content: React.ReactNode) => React.ReactNode
  isHighlighted: boolean
  onReply: ((message: MessageEntity) => void) | null
}

export default function Message({
  message,
  replyTo,
  displayedUsername,
  isEditing,
  profilePicture,
  isHighlighted,
  isDisplayedAsPinned,
  isLoadingCreate,
  switchEditing,
  onUpdateMessage,
  onDelete,
  cancelEditing,
  onPin,
  onReply,
  replaceTagEntity,
  replaceMentionChannel,
}: Readonly<MessageProps>) {
  const { control } = useFormContext()
  const formatDate = (dateString: string): string => {
    const date = DateTime.fromISO(dateString)
    const now = DateTime.now()

    if (
      date.hasSame(now, 'day') &&
      date.hasSame(now, 'year') &&
      date.hasSame(now, 'month')
    ) {
      return `Today ${date.toFormat('HH:mm')}`
    } else {
      return date.toFormat('dd/MM/yyyy HH:mm')
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        cancelEditing()
      } else if (event.key === 'Enter' && !event.shiftKey && onUpdateMessage) {
        event.preventDefault()
        onUpdateMessage()
      }
    }

    if (isEditing) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isEditing, cancelEditing, onUpdateMessage])

  // Convert markdown to Markdoc nodes
  const adjustLineBreaks = preprocessMarkdown(message.content)
  const nodes = Markdoc.parse(adjustLineBreaks)
  // Transform nodes to a Markdoc AST
  const ast = Markdoc.transform(nodes, config)
  // Render the AST to React elements
  const renderedMessage = replaceMentionChannel(
    replaceTagEntity(
      Markdoc.renderers.react(ast, React, {
        components: markdownComponents,
      })
    )
  )
  return (
    <div
      className={
        'flex flex-col gap-2 p-3 rounded-xl group w-full' +
        (isHighlighted
          ? ' bg-green-100/60 hover:bg-green-100'
          : ' hover:bg-violet-300')
      }
    >
      {replyTo && replyTo !== undefined && (
        <div className={'flex items-center ml-4 opacity-60'}>
          <Icon name="lucide:corner-up-right" className="w-4 h-4 mr-2" />
          <div className="reply-to bg-violet-100 p-2 rounded">
            <span className="text-sm text-gray-600">
              <strong>{replyTo?.owner?.username}</strong> :{' '}
              <i>
                {replyTo?.content?.length > 30
                  ? replyTo?.content?.substring(0, 30) + ' ...'
                  : replyTo?.content}
              </i>
            </span>
          </div>
        </div>
      )}
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-4 items-center">
          <div className="flex flex-row gap-3 items-center overflow-hidden">
            <img
              className="w-9 min-w-[36px] h-9 min-h-[36px] object-cover bg-violet-50 rounded-xl"
              src={profilePicture ?? '/picture.svg'}
              alt={displayedUsername}
            />
            <h5 className="font-semibold text-xs truncate">
              {displayedUsername}
            </h5>
          </div>

          <p className="font-normal text-xs truncate">
            {!isLoadingCreate && formatDate(message.createdAt ?? '')}
          </p>
        </div>
        <div className="flex flex-row gap-4 items-center invisible group-hover:visible pr-2">
          {!isDisplayedAsPinned && (
            <>
              {switchEditing && !isEditing && (
                <Button style={ButtonStyle.NONE} onClick={switchEditing}>
                  <Icon name="lucide:pencil" className="w-4 h-4" />
                </Button>
              )}
              {onDelete && (
                <Button style={ButtonStyle.NONE} onClick={onDelete}>
                  <Icon name="lucide:trash" className="w-4 h-4" />
                </Button>
              )}
              <Button style={ButtonStyle.NONE} onClick={onPin}>
                <Icon name="lucide:pin" className="w-5 h-5" />
              </Button>
              {onReply && (
                <Button
                  style={ButtonStyle.NONE}
                  onClick={() => onReply(message)}
                >
                  <Icon name="lucide:corner-up-left" className="w-5 h-5" />
                </Button>
              )}
            </>
          )}
          {isEditing && (
            <Button style={ButtonStyle.NONE} onClick={cancelEditing}>
              <Icon name="lucide:x" className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex flex-row gap-2 w-full">
        {isEditing ? (
          <div className="flex flex-row justify-between items-center gap-3 w-full">
            <Controller
              name="message"
              control={control}
              defaultValue={message.content || ''}
              render={({ field }) => (
                <div className="flex flex-row justify-between items-center gap-5 w-full">
                  <InputMessageArea
                    {...field}
                    type="text"
                    className="rounded-xl bg-violet-50 px-4 flex-grow w-full"
                  />
                  <Button
                    style={ButtonStyle.NONE}
                    onClick={() => {
                      if (onUpdateMessage) onUpdateMessage()
                    }}
                  >
                    <Icon name="lucide:save" className="w-10 h-10 visible" />
                  </Button>
                </div>
              )}
            />
          </div>
        ) : (
          <div
            className={cn(
              'rounded-xl rounded-tl-none p-6 flex flex-col gap-3',
              {
                'bg-violet-50': !isLoadingCreate,
                'bg-slate-500/30': isLoadingCreate,
              }
            )}
          >
            <div className={'text-xs font-semibold break-all'}>
              {renderedMessage}
            </div>
            {message.attachments?.map((attachment, i) => (
              <AttachmentFeature
                key={'attachment_' + i.toString()}
                attachment={attachment}
                isLoading={isLoadingCreate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
