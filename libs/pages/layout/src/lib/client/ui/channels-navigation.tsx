import { ChannelEntity, ServerEntity } from '@beep/contracts'
import {
  Badge,
  BadgeType,
  Button,
  ButtonSize,
  ButtonStyle,
  Icon,
} from '@beep/ui'
import { useState } from 'react'

import CurrentUserFeature from '../feature/current-user-feature'
import { ListChannels } from './list-channels'

export interface ChannelsNavigationProps {
  channels?: ChannelEntity[]
  server?: ServerEntity
  onAddChannel?: () => void
}

export default function ChannelsNavigation({
  channels,
  server,
  onAddChannel,
}: ChannelsNavigationProps) {
  const [isLeftDivVisible] = useState(false)

  return (
    <div
      className={isLeftDivVisible ? 'flex abolute w-full' : 'hidden lg:flex'}
    >
      <div
        className={`bg-violet-300 p-6 flex gap-6 flex-col h-[100dvh] ${
          isLeftDivVisible ? 'w-full' : 'sm:w-fit'
        }`}
      >
        {/* TODO: Add server DROPDOWN */}
        <div className="flex flex-row gap-6">
          <Button
            style={ButtonStyle.SQUARE}
            onClick={() => {
              console.log('click')
            }}
          >
            <img
              src={server?.picture}
              alt="Server"
              className="rounded-xl hover:rounded-2xl transition-all"
            />
          </Button>
          <div className="flex flex-col items-start justify-between">
            <h5 className="font-semibold max-w-[175px] truncate">
              {server?.name}
            </h5>
            <Badge
              type={BadgeType.DEFAULT}
              title={server?.id || ''}
              className="bg-violet-50 hover:bg-violet-100 !text-violet-900 max-w-[175px] truncate"
            />
          </div>
        </div>
        {/* TODO: DIALOG DE CREATION DE CHANNEL */}
        <Button
          iconLeft={'lucide:circle-plus'}
          size={ButtonSize.REGULAR}
          className="!bg-violet-400 px-2 xl:px-3 py-2 text-base font-semibold flex flex-row gap-2 items-center"
          onClick={onAddChannel}
        >
          <p>Add channel</p>
        </Button>
        <div className="flex flex-col gap-6 min-w-max flex-grow overflow-y-scroll no-scrollbar scroll-smooth">
          <div className="flex flex-col flex-grow gap-6">
            <div className="flex flex-col gap-1">
              <ListChannels channels={channels || []} />
            </div>
          </div>
        </div>
        <CurrentUserFeature />
      </div>
      <div className={isLeftDivVisible ? 'p-6 bg-violet-200 flex' : 'hidden'}>
        <Button
          onClick={() => {
            console.log('click')
          }}
          className="!bg-violet-300"
        >
          <Icon name="lucide:arrow-left" />
        </Button>
      </div>
    </div>
  )
}
