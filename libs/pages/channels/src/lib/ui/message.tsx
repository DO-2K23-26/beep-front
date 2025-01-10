import { MessageEntity } from '@beep/contracts'
import { Button, ButtonShadCn, ButtonStyle, Icon, InputMessageArea } from '@beep/ui'
import { cn } from '@beep/utils'
import Markdoc from '@markdoc/markdoc'
import React, { ReactNode, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import AttachmentFeature from '../feature/attachment-feature'
import { renderTextWithLinks } from '../utils/links-utils'
import { config, markdownComponents } from '../utils/markdown-config'
import { preprocessMarkdown } from '../utils/markdown-parser'
import { DeleteMessageDialog } from './delete-message-dialog'
import MediaEmbed from './media-embed'
import { ReplyToDisplay } from './reply-to-display'
import { MessageUserDisplay } from './message-user-display'
import { RotateCcw } from 'lucide-react'

interface MessageProps {
  message: MessageEntity
  isEditing: boolean
  isDisplayedAsPinned?: boolean
  isLoadingCreate: boolean | null
  isErrorCreate: boolean | null
  isHighlighted: boolean
  switchEditing: (() => void) | null
  onUpdateMessage: () => void
  onDelete?: () => void
  retryMessage: () => void
  cancelEditing: () => void
  onPin: () => void
  replaceUserTag: (message: ReactNode) => ReactNode
  replaceMentionChannel: (content: React.ReactNode) => React.ReactNode
  onReply: () => void
  containsUrl: () => boolean
}

export default function Message({
  message,
  isEditing,
  isHighlighted,
  isDisplayedAsPinned,
  isLoadingCreate,
  isErrorCreate,
  switchEditing,
  onUpdateMessage,
  onDelete,
  cancelEditing,
  retryMessage,
  onPin,
  onReply,
  replaceUserTag,
  replaceMentionChannel,
  containsUrl,
}: Readonly<MessageProps>) {
  const { control } = useFormContext()

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
    replaceUserTag(
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
      <ReplyToDisplay
        message={message.parentMessage}
        replaceTagEntity={replaceUserTag}
      />
      <div className="flex flex-row gap-2 justify-between">
        <MessageUserDisplay message={message} />
        <div className="flex flex-row gap-4 items-center sm:invisible group-hover:visible pr-2">
          {!isDisplayedAsPinned && !isErrorCreate && (
            <>
              {switchEditing && !isEditing && (
                <Button style={ButtonStyle.NONE} onClick={switchEditing}>
                  <Icon name="lucide:pencil" className="w-4 h-4" />
                </Button>
              )}
              {onDelete && (
                <DeleteMessageDialog onDeleteMessage={onDelete}>
                  <Icon name="lucide:trash" className="w-4 h-4" />
                </DeleteMessageDialog>
              )}
              <Button style={ButtonStyle.NONE} onClick={onPin}>
                <Icon name="lucide:pin" className="w-5 h-5" />
              </Button>
              {onReply && (
                <Button style={ButtonStyle.NONE} onClick={onReply}>
                  <Icon name="lucide:corner-up-left" className="w-5 h-5" />
                </Button>
              )}
            </>
          )}
          {isErrorCreate && (
            <>
              <span className="text-red-600 visible">
                ⓘ Failed to send message
              </span>
              <Button
                style={ButtonStyle.NONE}
                className="visible"
                onClick={retryMessage}
              >
                <RotateCcw color="#ef4444" />
              </Button>
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
                  <Button style={ButtonStyle.NONE} onClick={onUpdateMessage}>
                    <Icon name="lucide:save" className="w-10 h-10 visible" />
                  </Button>
                </div>
              )}
            />
          </div>
        ) : (
          <div
            className={cn(
              'rounded-xl rounded-tl-none py-2 sm:py-4 md:py-6 px-2 w-full sm:px-4 md:px-6 flex flex-col',
              {
                'bg-violet-50': !isLoadingCreate,
                'bg-slate-500/30': isLoadingCreate,
                '[&>*]:[&>*]:text-red-600': isErrorCreate,
              }
            )}
          >
            {containsUrl()
              ? renderTextWithLinks(message.content)
              : renderedMessage}
            {containsUrl() && <MediaEmbed text={message.content} />}
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
