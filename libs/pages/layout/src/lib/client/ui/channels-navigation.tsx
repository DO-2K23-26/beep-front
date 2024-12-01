import { getChannelsState } from '@beep/channel'
import {
  ChannelEntity,
  ChannelType,
  OccupiedChannelEntity,
  ServerEntity,
} from '@beep/contracts'
import { getResponsiveState } from '@beep/responsive'
import {
  Badge,
  BadgeType,
  ButtonIcon,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  UseModalProps,
} from '@beep/ui'
import { getUserState } from '@beep/user'
import { useEffect, useState } from 'react'
import { FormProvider, UseFormReturn } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { ConnectedChannelRow } from './connect-channel-row'
import { ListTextChannels } from './list-channels'
import { ListVoiceChannels } from './list-voice-channels'

import { cn } from '@beep/utils'
import { getVoiceState } from '@beep/voice'
import { useTranslation } from 'react-i18next'
import CurrentUserFeature from '../feature/current-user-feature'
import { CreateChannelModal } from './create-channel-modal'
import { ServerDropdown } from './server-dropdown'
import { ServerPictureButton } from './server-picture-button'

export interface ChannelsNavigationProps {
  textChannels?: ChannelEntity[]
  voiceChannels?: ChannelEntity[]
  streamingUsers: OccupiedChannelEntity[]
  server?: ServerEntity
  banner?: string
  onClickId: (id: string) => void
  onCreateChannel: () => void
  onLeaveVoiceChannel: () => void
  onJoinVoiceChannel: (channel: ChannelEntity) => void
  onJoinTextChannel: (serverId: string, channelId: string) => void
  openModal: React.Dispatch<React.SetStateAction<UseModalProps | undefined>>
  closeModal: () => void
  methodsAddChannel: UseFormReturn<{ name: string; type: ChannelType }>
  hideLeftDiv?: () => void
}

export default function ChannelsNavigation({
  textChannels,
  voiceChannels,
  server,
  streamingUsers,
  banner,
  onClickId,
  onCreateChannel,
  onJoinVoiceChannel,
  onJoinTextChannel,
  onLeaveVoiceChannel,
  openModal,
  closeModal,
  methodsAddChannel,
}: ChannelsNavigationProps) {
  const { t } = useTranslation()

  const { showLeftPane } = useSelector(getResponsiveState)
  const { connected, focusedChannel, serverName } =
    useSelector(getChannelsState)
  const { payload } = useSelector(getUserState)

  const [isAdmin, setIsAdmin] = useState(false)
  const { connectionState } = useSelector(getVoiceState)

  useEffect(() => {
    if (server) {
      if (!payload) {
        return
      }
      setIsAdmin(server.ownerId === payload.sub)
    }
  }, [server, payload])

  const openCreateChannelModal = () => {
    openModal({
      content: (
        <FormProvider {...methodsAddChannel}>
          <CreateChannelModal
            closeModal={closeModal}
            onCreateChannel={onCreateChannel}
            methodsAddChannel={methodsAddChannel}
          />
        </FormProvider>
      ),
    })
  }

  return (
    <div
      className={cn('h-full w-full', {
        'sm:flex': showLeftPane,
        'hidden lg:flex': !showLeftPane,
      })}
    >
      <div className=" bg-violet-300 p-3 lg:p-6 flex flex-col h-full w-full justify-between">
        {/* Top bar: Server information */}

        <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 h-full">
          <div
            className="flex flex-col md:flex-row gap-2 sm:gap-3 md:gap-4 bg-white bg-opacity-10 rounded-xl p-2 md:p-4 w-full items-center h-fit object-scale-down bg-cover bg-center"
            style={{ backgroundImage: `url(${banner})` }}
          >
            {server && (
              <ServerDropdown
                server={server}
                onClickId={onClickId}
                openModal={openModal}
                closeModal={closeModal}
                isAdmin={isAdmin}
              >
                <ServerPictureButton server={server} />
              </ServerDropdown>
            )}
            <div className="flex flex-row md:flex-col items-start gap-4 md:justify-between w-fit">
              <p className="font-semibold max-w-10 md:max-w-32 text-xs md:text-sm lg:text-base truncate">
                {server?.name}
              </p>
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    type={BadgeType.DEFAULT}
                    title={server?.id ?? ''}
                    className="flex bg-violet-50 hover:bg-violet-100 !text-violet-900 max-w-32 truncate cursor-pointer"
                    onClick={() => onClickId(server?.id ?? '')}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{server?.id ?? ''}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          {/* Create channel modal */}
          {isAdmin && (
            <ButtonIcon
              icon={'lucide:circle-plus'}
              className="bg-violet-400 px-2 xl:px-3 py-2 font-semibold"
              onClick={openCreateChannelModal}
              title={t('layout.channels-navigation.create_channel')}
              buttonProps={{ variant: 'hoverRounded' }}
              textHiddenResponsive
            />
          )}
          {/* Channels list */}

          <div className="flex flex-col gap-2 overflow-y-scroll scroll-smooth scroll-bar h-full">
            <ListTextChannels
              channels={textChannels || []}
              onJoinTextChannel={onJoinTextChannel}
            />
            <ListVoiceChannels
              channels={voiceChannels || []}
              occupiedChannels={streamingUsers}
              onJoinChannel={onJoinVoiceChannel}
            />
          </div>

          {/* Bottom bar: User information / vocal information */}
          {connected && (
            <ConnectedChannelRow
              connectionState={connectionState}
              onLeave={onLeaveVoiceChannel}
              channelName={focusedChannel.name}
              serverName={serverName}
            />
          )}
          <CurrentUserFeature />
        </div>
      </div>
    </div>
  )
}
