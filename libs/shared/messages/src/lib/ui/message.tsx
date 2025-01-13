import { cn } from '@beep/utils'
import Markdoc from '@markdoc/markdoc'
import React, { useContext } from 'react'
import AttachmentFeature from '../feature/attachment-feature'
import { MessageContext } from '../feature/message-feature'
import { MessageToolbarFeature } from '../feature/message-toolbar-feature'
import { containsUrl, renderTextWithLinks } from '../utils/links-utils'
import { config, markdownComponents } from '../utils/markdown-config'
import { preprocessMarkdown } from '../utils/markdown-parser'
import MediaEmbed from './media-embed'
import { MessageUserDisplay } from './message-user-display'
import { ReplyToDisplay } from './reply-to-display'
import { UpdateMessageInput } from './update-message-input'

export default function Message() {
  const {
    message,
    isEditing,
    isLoadingCreate,
    isErrorCreate,
    isHighlighted,
    replaceMentionChannel,
    replaceUserTag,
  } = useContext(MessageContext)
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
      <ReplyToDisplay />
      <div className="flex flex-row gap-2 justify-between">
        <MessageUserDisplay />
        <MessageToolbarFeature />
      </div>
      <div className="flex flex-row gap-2 w-full">
        {isEditing && <UpdateMessageInput />}
        {!isEditing && (
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
            {containsUrl(message)
              ? renderTextWithLinks(message.content)
              : renderedMessage}
            {containsUrl(message) && <MediaEmbed text={message.content} />}
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
