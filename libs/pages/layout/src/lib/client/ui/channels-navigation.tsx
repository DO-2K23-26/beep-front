import { ChannelEntity, ChannelType, ServerEntity } from '@beep/contracts'
import {
  Badge,
  BadgeType,
  Button,
  ButtonSize,
  ButtonStyle,
  Icon,
  InputText,
  UseModalProps,
} from '@beep/ui'

import { getResponsiveState } from '@beep/responsive'
import {
  Controller,
  FormProvider,
  UseFormReturn,
  useFormContext,
} from 'react-hook-form'
import { useSelector } from 'react-redux'
import CurrentUserFeature from '../feature/current-user-feature'
import { ListTextChannels } from './list-channels'
import { ListVoiceChannels } from './list-voice-channels'
import { ConnectedChannelRow } from './connect-channel-row'
import { getChannelsState } from '@beep/channel'

export interface ChannelsNavigationProps {
  textChannels?: ChannelEntity[]
  voiceChannels?: ChannelEntity[]
  server?: ServerEntity
  onCreateChannel: () => void
  onLeaveVoiceChannel: () => void
  onJoinVoiceChannel: (channel:ChannelEntity) => void 
  openModal: React.Dispatch<React.SetStateAction<UseModalProps | undefined>>
  closeModal: () => void
  methodsAddChannel: UseFormReturn<{ name: string; type: ChannelType }>

  hideLeftDiv?: () => void
}

export default function ChannelsNavigation({
  textChannels,
  voiceChannels,
  server,
  onCreateChannel,
  onJoinVoiceChannel,
  onLeaveVoiceChannel,
  openModal,
  closeModal,
  methodsAddChannel,
  hideLeftDiv,
}: ChannelsNavigationProps) {
  const { showLeftPane } = useSelector(getResponsiveState)
  const { connected } = useSelector(getChannelsState)
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
            <Badge
              type={BadgeType.DEFAULT}
              title={server?.id ?? ''}
              className="bg-violet-50 hover:bg-violet-100 !text-violet-900 max-w-[175px] truncate"
            />
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
                occupiedChannels={[]}
                onJoinChannel={onJoinVoiceChannel}
                onDeleteChannel={(id) => {}}
              />
            </div>
          </div>
        </div>
        {connected && <ConnectedChannelRow onLeave={onLeaveVoiceChannel} />}
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

interface CreateChannelModalProps {
  closeModal: () => void
  onCreateChannel: () => void
  methodsAddChannel: UseFormReturn<{ name: string; type: ChannelType }>
}

function CreateChannelModal({
  closeModal,
  onCreateChannel,
  methodsAddChannel,
}: CreateChannelModalProps) {
  const { control } = useFormContext()

  return (
    <div className="p-6">
      <h3 className=" text-slate-700 font-bold mb-2 max-w-sm">
        Create channel
      </h3>
      <div className="text-slate-500 text-sm mb-4">
        Choose a name for your channel
      </div>
      <Controller
        name="name"
        rules={{
          required: 'Please enter a name.',
          minLength: {
            value: 1,
            message: 'Please enter a name.',
          },
        }}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <InputText
            className="w-full !rounded-lg min-h-[40px] mb-4"
            label={'Channel name'}
            name="name"
            type="text"
            onChange={field.onChange}
            value={field.value}
            error={error?.message}
          />
        )}
      />
      <div className="ml-4 pb-2">
        <input
          className="mr-2"
          type="radio"
          value={ChannelType.TEXT}
          {...methodsAddChannel.register('type')}
        />
        Texte
      </div>
      <div className="ml-4 pb-6">
        <input
          className="mr-2"
          type="radio"
          value={ChannelType.VOICE}
          {...methodsAddChannel.register('type')}
        />
        Voice
      </div>
      <div className="flex gap-3 justify-between">
        <Button
          className="btn--no-min-w"
          style={ButtonStyle.STROKED}
          onClick={() => closeModal()}
        >
          Cancel
        </Button>
        <Button
          className="btn--no-min-w"
          style={ButtonStyle.BASIC}
          onClick={() => {
            onCreateChannel()
          }}
        >
          Create
        </Button>
      </div>
    </div>
  )
}
