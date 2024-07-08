import {
  ChannelEntity,
  ChannelType,
  OccupiedChannelEntity,
  ServerEntity,
} from '@beep/contracts'
import { Button, ButtonSize, ButtonStyle, Icon, UseModalProps } from '@beep/ui'

import { getChannelsState } from '@beep/channel'
import { getResponsiveState } from '@beep/responsive'
import { useTransmitBannerQuery, useTransmitPictureQuery } from '@beep/server'
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
import { CreateChannelModal } from './create-channel-modal'
import { ServerDropdown } from './server-dropdown'
import { ServerPictureButton } from './server-picture-button'

export interface ChannelsNavigationProps {
  textChannels?: ChannelEntity[]
  voiceChannels?: ChannelEntity[]
  streamingUsers: OccupiedChannelEntity[]
  server?: ServerEntity
  onClickId: (id: string) => void
  onCreateChannel: () => void
  onLeaveVoiceChannel: () => void
  onJoinVoiceChannel: (channel: ChannelEntity) => void
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
  onClickId,
  onCreateChannel,
  onJoinVoiceChannel,
  onLeaveVoiceChannel,
  openModal,
  closeModal,
  methodsAddChannel,
  hideLeftDiv,
}: ChannelsNavigationProps) {
  const { showLeftPane } = useSelector(getResponsiveState)
  const { connected, focusedChannel, serverName } =
    useSelector(getChannelsState)
  const [isAdmin, setIsAdmin] = useState(false)

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

  const banner = useTransmitBannerQuery(server?.id ?? '').currentData ?? ''
  const icon = useTransmitPictureQuery(server?.id ?? '').currentData ?? ''

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
            triggerDropdownButton={
              <ServerPictureButton icon={icon} server={server} />
            }
            server={server}
            icon={icon}
            onClickId={onClickId}
            openModal={openModal}
            closeModal={closeModal}
            settings={[subSetting]}
            isAdmin={isAdmin}
          />
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
            <p>Create channel</p>
          </Button>
        )}
        {/* Channels list */}
        <div className="flex flex-col gap-6 min-w-max flex-grow overflow-y-scroll no-scrollbar scroll-smooth">
          <div className="flex flex-col flex-grow gap-6">
            <div className="flex flex-col gap-1">
              <ListTextChannels channels={textChannels || []} />
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
