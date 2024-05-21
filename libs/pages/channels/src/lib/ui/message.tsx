import React from "react";
import { MessageEntity, UserEntity } from '@beep/contracts'
import { Button, ButtonStyle, Icon, Input } from '@beep/ui'
import { Controller } from 'react-hook-form'
import AttachmentFeature from '../feature/attachment-feature'
import Markdoc from "@markdoc/markdoc";
import { config, markdownComponents } from "../utils/markdown-config";
import { preprocessMarkdown } from "../utils/markdown-parser";

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
  createdAt: string
  updatedAt?: string
  control?: any
}

export default function Message({
  user,
  message,
  onDelete,
  isEditing,
  switchEditing,
  profilePicture,
  onUpdateMessage,
  createdAt,
  control
}: Readonly<MessageProps>) {

  // Convert markdown to Markdoc nodes
  const adjustLineBreaks = preprocessMarkdown(message.content);
  const nodes = Markdoc.parse(adjustLineBreaks);
  // Transform nodes to a Markdoc AST
  const ast = Markdoc.transform(nodes, config);
  // Render the AST to React elements
  const renderedMessage = Markdoc.renderers.react(ast, React, {
    components: markdownComponents,
  });

  return (
    <div className="flex flex-col gap-2 hover:bg-violet-300 p-3 rounded-xl group">
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
          {
            switchEditing && isEditing ? (
              <></>
            ) : (
              <>
              {
                switchEditing ? <Button style={ButtonStyle.NONE} onClick={switchEditing}><Icon name="lucide:pencil" className="w-4 h-4 hidden" /></Button> : <></>
              }
              {
                onDelete ? <Button style={ButtonStyle.NONE} onClick={onDelete}><Icon name="lucide:trash" className="w-4 h-4 hidden" /></Button> : <></>
              }
              </>
            )
          }
        </div>
      </div>
      <div className="flex flex-row gap-2 ">
        {
          isEditing && switchEditing && control ? (
            <div className='flex flex-row justify-between items-center gap-3'>
              <Controller
              name={'message-' + message.id}
              control={control}
              render={({ field }) => (
                <Input
                  type='text'
                  name={'message-' + message.id}
                  value={field.value}
                  className="rounded-xl bg-violet-50 px-4 h-full w-full"
                  placeholder="Update your message"
                  onChange={field.onChange}
                  onKeyDown={(e: any) => e.key === 'Enter' ? onUpdateMessage() : {}}
                />
              )}
            />
            <Button style={ButtonStyle.NONE} onClick={onUpdateMessage}>
              <Icon name="lucide:save" className="w-10 h-10 hidden" />
            </Button>
          </div>
          ) : (
            <div className="bg-violet-50 rounded-xl rounded-tl-none p-6 flex flex-col gap-3">
              <div className="text-xs font-semibold break-all">
                {renderedMessage}
              </div>
              
              {
                message.attachments ?
                  message.attachments.map((attachment, i) => {
                    return <AttachmentFeature attachment={attachment} key={i} />
                  }) : <></>
              }
            </div>
          )
        }
      </div>
    </div>
  )
}
