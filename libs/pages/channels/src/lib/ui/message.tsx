import { MessageEntity, UserEntity } from '@beep/contracts'
import { Button, ButtonStyle, Icon, Input } from '@beep/ui'
import Markdoc from '@markdoc/markdoc'
import React, { ReactNode, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import AttachmentFeature from '../feature/attachment-feature'
import { config, markdownComponents } from '../utils/markdown-config'
import { preprocessMarkdown } from '../utils/markdown-parser'

interface MessageProps {
  message: MessageEntity
  user?: UserEntity
  image?: string
  gif?: string
  video?: string
  isEditing: boolean
  profilePicture?: string
  switchEditing: (() => void) | null
  onUpdateMessage: () => void
  onDelete: (() => void) | null
  cancelEditing: () => void
  createdAt: string
  updatedAt?: string
  onPin: () => void
  isPinned?: boolean
  replaceTagEntity: (message: ReactNode) => ReactNode
  replaceMentionChannel: (content: React.ReactNode) => React.ReactNode
  isHighlighted: boolean
  onReply: (message: MessageEntity) => void
}

export default function Message({
  message,
  user,
  image,
  gif,
  video,
  isEditing,
  profilePicture,
  switchEditing,
  onUpdateMessage,
  onDelete,
  cancelEditing,
  createdAt,
  updatedAt,
  onPin,
  isPinned,
  onReply,
  replaceTagEntity,
  replaceMentionChannel,
  isHighlighted,
}: Readonly<MessageProps>) {
  const { control } = useFormContext()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        cancelEditing()
      } else if (event.key === 'Enter') {
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

  // Ajoutez cette logique dans le composant Message
  return (
    <div className={'flex flex-col gap-2 p-3 rounded-xl group' + (isHighlighted ? ' bg-green-100/60 hover:bg-green-100' : ' hover:bg-violet-300')}>
  {message.parentMessage && (
    <div className={'flex items-center ml-4 opacity-60'}>
      <Icon name="lucide:corner-up-right" className="w-4 h-4 mr-2" />
      <div className="reply-to bg-violet-100 p-2 rounded">
        <span className="text-sm text-gray-600">
          <strong>{message.parentMessage?.owner?.username}</strong> :{' '}
          <i>{message.parentMessage?.content.length > 30 ? message.parentMessage?.content.substring(0, 30) + " ..." : message.parentMessage?.content}</i>
        </span>{' '}
      </div>
    </div>
  )}
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-4 items-center">
          <div className="flex flex-row gap-3 items-center overflow-hidden">
            <img
              className="w-9 min-w-[36px] h-9 min-h-[36px] object-cover bg-violet-50 rounded-xl"
              src={(profilePicture && profilePicture) || '/picture.svg'}
              alt={user && user.username + '-img'}
            />
            <h5 className="font-semibold text-xs truncate">
              {(user && user.username) || 'Casper'}
            </h5>
          </div>
          <p className="font-normal text-xs truncate">{createdAt}</p>
        </div>
        <div className="flex flex-row gap-4 items-center invisible group-hover:visible pr-2">
          {!isPinned && (
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
              <Button style={ButtonStyle.NONE} onClick={() => onReply(message)}>
                <Icon name="lucide:corner-up-left" className="w-5 h-5" />
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
      <div className="flex flex-row gap-2">
        {isEditing ? (
          <div className="flex flex-row justify-between items-center gap-3">
            <Controller
              name="message"
              control={control}
              defaultValue={message.content || ''}
              render={({ field }) => (
                <div className="flex flex-row justify-between items-center gap-3">
                  <Input
                    {...field}
                    type="text"
                    className="rounded-xl bg-violet-50 px-4 h-full w-full"
                  />
                  <Button
                    style={ButtonStyle.NONE}
                    onClick={() => onUpdateMessage()}
                  >
                    <Icon name="lucide:save" className="w-10 h-10 visible" />
                    
                  </Button>
                </div>
              )}
            />
          </div>
        ) : (
          <div className="bg-violet-50 rounded-xl rounded-tl-none p-6 flex flex-col gap-3">
            <div className="text-xs font-semibold break-all">
              {renderedMessage}
            </div>

            {message.attachments &&
              message.attachments.map((attachment, i) => (
                <AttachmentFeature attachment={attachment} key={i} />
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
