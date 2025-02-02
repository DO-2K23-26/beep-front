import { getChannelsState } from '@beep/channel'
import { getResponsiveState } from '@beep/responsive'
import {
  Badge,
  BadgeType,
  ButtonIcon,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@beep/ui'
import { useContext } from 'react'
import { useSelector } from 'react-redux'
import { ConnectedChannelRow } from './connect-channel-row'
import { ListChannels } from './list-channels'

import { usePatchChannelPositionMutation } from '@beep/server'
import { cn } from '@beep/utils'
import { getVoiceState } from '@beep/voice'
import { useTranslation } from 'react-i18next'
import { ChannelContext } from '../feature/channels/channels-navigation-context'
import { CurrentUserFeature } from '../feature/current-user/current-user-feature'
import { ServerDropdown } from './server-dropdown'
import { ServerPictureButton } from './server-picture-button'
import { Permissions } from '@beep/contracts'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ServerContext } from '@beep/pages/channels'

export interface ChannelsNavigationProps {
  banner?: string
}

export default function ChannelsNavigation({
  banner,
}: ChannelsNavigationProps) {
  const { t } = useTranslation()

  const { showLeftPane } = useSelector(getResponsiveState)
  const { connected, focusedChannel, serverName } =
    useSelector(getChannelsState)
  const { connectionState } = useSelector(getVoiceState)
  const [moveChannel] = usePatchChannelPositionMutation()
  const {
    openCreateChannelModal,
    openModal,
    closeModal,
    onLeaveVoiceChannel,
    server,
    onClickId,
    channels,
  } = useContext(ChannelContext)

  const { myMember } = useContext(ServerContext)

  return (
    <div
      className={cn('h-full w-full', {
        'sm:flex': showLeftPane,
        'hidden lg:flex': !showLeftPane,
      })}
    >
      <div className=" bg-violet-300 p-3 flex flex-col h-full w-full justify-between">
        {/* Top bar: Server information */}

        <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 w-fit h-full">
          <div
            className="flex flex-col md:flex-row gap-2 sm:gap-3 md:gap-4 bg-white bg-opacity-10 rounded-xl p-2 md:p-4 w-full items-center h-fit object-scale-down bg-cover bg-center"
            style={{ backgroundImage: `url(${banner})` }}
          >
            {server && (
              <div className='size-fit'>
                <ServerDropdown
                  server={server}
                  onClickId={onClickId}
                  openModal={openModal}
                  closeModal={closeModal}
                >
                  <ServerPictureButton server={server} />
                </ServerDropdown>
              </div>
            )}
            <div className="flex flex-row md:flex-col items-start gap-4 md:justify-between ">
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
          {(!myMember ||
            myMember?.hasPermission(Permissions.MANAGE_CHANNELS)) && (
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
            {myMember?.hasPermission(Permissions.VIEW_CHANNELS) || !myMember ? (
            <ListChannels
              channels={channels}
            />
            ) : (
              <div className="flex justify-center w-full">
                <p className="text-xs md:text-sm  text-center text-violet-900 ">
                  {t('layout.channels-navigation.cannot_see_channel')}
                </p>
              </div>
            )}
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
          <div className="flex justify-center w-full sm:min-w-32">
            <CurrentUserFeature />
          </div>
        </div>
      </div>
    </div>
  )
}
