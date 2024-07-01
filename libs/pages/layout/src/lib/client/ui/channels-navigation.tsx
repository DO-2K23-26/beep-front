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
  DialogCloseButton,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  FullScreenDialog,
  FullScreenDialogContent,
  FullScreenDialogTrigger,
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
import {
  getServersState,
  useTransmitBannerQuery,
  useTransmitPictureQuery,
} from '@beep/server'
import { ServerDropdownMenu } from './server-dropdown-menu'
import { OverviewSettingsServer } from './overview-settings-server'
import { getUserState } from '@beep/user'
import { useEffect, useState } from 'react'

import { warn } from 'console'
import DestroyServerFeature from '../feature/destroy-server-feature'
import { get } from 'http'

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

  useEffect(() => {
    if (server) {
      if (!payload) {
        return
      }
      setIsAdmin(server.ownerId === payload.sub)
      console.log('isAdmin', server.ownerId === payload.sub)
    }
  }, [server, payload])

  const banner = useTransmitBannerQuery(server?.id || '').currentData || ''
  const icon = useTransmitPictureQuery(server?.id || '').currentData || ''

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
            ) : (
              <></>
            )}
          </div>
          <div className="relative z-0 flex flex-row gap-6 p-5 bg-white bg-opacity-10 rounded-xl">
            {/* <div className="flex flex-row gap-6"> */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  style={ButtonStyle.SQUARE}
                  onClick={() => {
                    console.log('click')
                  }}
                >
                  {server ? (
                    icon ? (
                      <img
                        src={icon}
                        alt="Server"
                        className=" aspect-square rounded-xl hover:rounded-2x3 transition-all object-cover"
                      />
                    ) : (
                      <p className="max-w-[175px] truncate">{server.name[0]}</p>
                    )
                  ) : (
                    <p>@ME</p>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-lg bg-violet-50 mt-4 mx-5 py-4 px-3">
                {/* <DropdownMenuItemCustom
                label="Invite users"
                iconName="lucide:credit-card"
              /> //need dorian PR*/}
                {/* {isAdmin && (
                <DropdownMenuItemCustom
                  label="Create channel"
                  iconName="lucide:plus"
                  onClick={() =>
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
                />
            )} */}
                {/* { <p> feature is coming</p>} */}
                {server && (
                  <FullScreenDialog>
                    <FullScreenDialogTrigger asChild>
                      <button>
                        <DropdownMenuItemCustom
                          label="Settings"
                          iconName="lucide:settings"
                        />
                      </button>
                    </FullScreenDialogTrigger>
                    <FullScreenDialogContent className="w-full h-full bg-white">
                      <OverviewSettingsServer
                        server={server}
                        isAdmin={isAdmin}
                      />
                    </FullScreenDialogContent>
                  </FullScreenDialog>
                )}

                <hr className="bg-slate-400 h-[1px] my-2 text-slate-400" />
                {/* <DropdownMenuItemCustom
                label="Leave server"
                iconName="charm:sign-out"
                warning
              /> */}
                {isAdmin && (
                  <DropdownMenuItemCustom
                    label="Destroy server"
                    iconName="lucide:trash-2"
                    warning
                    onClick={() => {
                      openModal({
                        content: (
                          <DestroyServerFeature closeModal={closeModal} />
                        ),
                      })
                    }}
                  />
                )}
              </DropdownMenuContent>
            </DropdownMenu>

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
              {/* ======= */}
              {/*  */}
              {/* <div className="relative z-0 flex flex-row gap-6 p-5 bg-white bg-opacity-10 rounded-xl"> */}
              {/* <ServerDropdownMenu server={server} /> */}
              {/* <div className="flex flex-col items-start justify-between"> */}
              {/* </h5> */}
              {/*  */}
              {/* </div> */}
              {/* >>>>>>> 32ec56f (feat: banner and icon on channel navigation) */}
            </div>
          </div>
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
                  console.log('add Logic to delete a channel')
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

interface DropdownMenuItemCustomProps {
  onClick?: () => void
  label: string
  iconName?: string
  className?: string
  warning?: boolean
}
function DropdownMenuItemCustom({
  onClick,
  label,
  iconName,
  className,
  warning,
}: DropdownMenuItemCustomProps) {
  const colors = {
    default: 'text-tint-900 hover:bg-violet-100 hover:text-tint-900',
    warning: 'text-red-600 fill-red-600 hover:bg-red-100 hover:text-red-600',
  }
  const focusedColor = warning ? colors.warning : colors.default
  return (
    <button
      className={`flex items-center gap-2 pl-2 py-1 pr-9 ${className} ${focusedColor} rounded-md  transition-colors cursor-pointer`}
      onClick={onClick}
    >
      {iconName && <Icon className={`${focusedColor}`} name={iconName} />}
      <p className={`font-bold ${focusedColor}`}>{label}</p>
    </button>
  )
}
