import { getChannelsState } from '@beep/channel'
import {
  ChannelEntity,
  ChannelType,
  OccupiedChannelEntity,
  ServerEntity,
} from '@beep/contracts'
import { getResponsiveState } from '@beep/responsive'
import { Button, ButtonSize, ButtonStyle, Icon, UseModalProps } from '@beep/ui'
import { getUserState } from '@beep/user'
import { useEffect, useState } from 'react'
import { FormProvider, UseFormReturn } from 'react-hook-form'
import { useSelector } from 'react-redux'
import CurrentUserFeature from '../feature/current-user-feature'
import { ConnectedChannelRow } from './connect-channel-row'
import { ListTextChannels } from './list-channels'
import { ListVoiceChannels } from './list-voice-channels'
import { OverviewSettingsServer } from './overview-settings-server'

import { SettingBodyWidth, SubSettings } from '@beep/settings'
import { getVoiceState } from '@beep/voice'
import { CreateChannelModal } from './create-channel-modal'
import { ServerDropdown } from './server-dropdown'
import { ServerPictureButton } from './server-picture-button'
import { useTranslation } from 'react-i18next'

export interface ChannelsNavigationProps {
  textChannels?: ChannelEntity[]
  voiceChannels?: ChannelEntity[]
  streamingUsers: OccupiedChannelEntity[]
  server?: ServerEntity
  icon?: string
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
  icon,
  onClickId,
  onCreateChannel,
  onJoinVoiceChannel,
  onJoinTextChannel,
  onLeaveVoiceChannel,
  openModal,
  closeModal,
  methodsAddChannel,
  hideLeftDiv,
}: ChannelsNavigationProps) {
  const { t } = useTranslation()

  const { showLeftPane } = useSelector(getResponsiveState)
  const { connected, focusedChannel, serverName } =
    useSelector(getChannelsState)
  const [isAdmin, setIsAdmin] = useState(false)
  const { connectionState } = useSelector(getVoiceState)
  const { payload } = useSelector(getUserState)
  // List of setting in the user setting modal
  const subSetting: SubSettings = {
    subGroupSettingTitle: 'Server',
    settings: [
      {
        title: 'Overview',
        settingComponent: server && (
          <OverviewSettingsServer server={server} isAdmin={isAdmin} />
        ),
        settingBodySize: SettingBodyWidth.L,
      },
    ],
  }
  useEffect(() => {
    if (server) {
      if (!payload) {
        return
      }
      setIsAdmin(server.ownerId === payload.sub)
    }
  }, [server, payload])

  return (
    <div className={showLeftPane ? 'flex abolute w-full' : 'hidden lg:flex'}>
      <div
        className={`bg-violet-300 p-6 flex gap-6 flex-col h-[100dvh] ${
          showLeftPane ? 'w-full' : 'sm:w-fit'
        }`}
      >
        <div className="relative">
          {/* Server infos */}
          <div className="absolute inset-0 z-0">
            {banner ? (
              <img
                src={banner}
                alt="Server"
                className=" rounded-xl hover:rounded-2x3 transition-all object-cover truncate  h-[100px] w-full"
              />
            ) : null}
          </div>

          <ServerDropdown
            server={server}
            onClickId={onClickId}
            openModal={openModal}
            closeModal={closeModal}
            settings={[subSetting]}
            isAdmin={isAdmin}
          >
            <div>
              <ServerPictureButton icon={icon} server={server} />
            </div>
          </ServerDropdown>
        </div>

        {/* Create channel modal */}

        {isAdmin && (
          <Button
            iconLeft={'lucide:circle-plus'}
            size={ButtonSize.REGULAR}
            className="!bg-violet-400 px-2 xl:px-3 py-2 text-base font-semibold flex flex-row gap-2 items-center"
            onClick={() => {
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
            }}
          >
            <p>{t('layout.channels-navigation.create_channel')}</p>
          </Button>
        )}
        {/* Channels list */}
        <div className="flex flex-col gap-6 min-w-max flex-grow overflow-y-scroll no-scrollbar scroll-smooth">
          <div className="flex flex-col flex-grow gap-6">
            <div className="flex flex-col gap-1">
              <ListTextChannels
                channels={textChannels || []}
                onJoinTextChannel={onJoinTextChannel}
              />
              <ListVoiceChannels
                channels={voiceChannels || []}
                occupiedChannels={streamingUsers}
                onJoinChannel={onJoinVoiceChannel}
                onDeleteChannel={(id) => {
                  //TODO: Add delete channel
                }}
              />
            </div>
          </div>
        </div>
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
      {/* Responsive button */}
      <div className={showLeftPane ? 'p-6 bg-violet-200 flex' : 'hidden'}>
        <Button
          onClick={hideLeftDiv}
          style={ButtonStyle.SQUARE}
          className="!bg-violet-300"
        >
          <Icon name="lucide:arrow-left" />
        </Button>
      </div>
    </div>
  )
}
