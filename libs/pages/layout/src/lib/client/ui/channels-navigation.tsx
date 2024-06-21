import {
  ChannelEntity,
  ChannelType,
  OccupiedChannelEntity,
  ServerEntity,
} from '@beep/contracts'
import {
  Badge,
  BadgeType,
  Button,
  ButtonSize,
  ButtonStyle,
  Icon,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  UseModalProps,
} from '@beep/ui'

import { getChannelsState } from '@beep/channel'
import { getResponsiveState } from '@beep/responsive'
import { FormProvider, UseFormReturn } from 'react-hook-form'
import { useSelector } from 'react-redux'
import CurrentUserFeature from '../feature/current-user-feature'
import { ConnectedChannelRow } from './connect-channel-row'
import { CreateChannelModal } from './create-channel-modal'
import { ListTextChannels } from './list-channels'
import { ListVoiceChannels } from './list-voice-channels'
import { getServersState } from '@beep/server'

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
  const { connected, focusedChannel } = useSelector(getChannelsState)
  return (
    <div className={showLeftPane ? 'flex abolute w-full' : 'hidden lg:flex'}>
      <div
        className={`bg-violet-300 p-6 flex gap-6 flex-col h-[100dvh] ${
          showLeftPane ? 'w-full' : 'sm:w-fit'
        }`}
      >
        {/* Server infos */}
        <div className="flex flex-row gap-6">
          <Button
            style={ButtonStyle.SQUARE}
            onClick={() => {
              console.log('click')
            }}
          >
            {server ? (
              server.picture ? (
                <img
                  src={server?.picture}
                  alt="Server"
                  className="rounded-xl hover:rounded-2xl transition-all"
                />
              ) : (
                <p className="max-w-[175px] truncate">{server.name[0]}</p>
              )
            ) : (
              <p>@ME</p>
            )}
          </Button>
          <div className="flex flex-col items-start justify-between">
            <h5 className="font-semibold max-w-[175px] truncate">
              {server?.name}
            </h5>
            <Tooltip>
              <TooltipTrigger>
                <Badge
                  type={BadgeType.DEFAULT}
                  title={server?.id ?? ''}
                  className="bg-violet-50 hover:bg-violet-100 !text-violet-900 max-w-[175px] truncate cursor-pointer"
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
                  console.log('add Logic to delete a channel')
                }}
              />
            </div>
          </div>
        </div>
        {connected && <ConnectedChannelRow onLeave={onLeaveVoiceChannel} channelName={focusedChannel.name} serverName={ server?.name } />}
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
