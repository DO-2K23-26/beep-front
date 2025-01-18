import {
  ChannelEntity,
  ChannelType,
  CreateChannelRequest,
  OccupiedChannelEntity,
  ServerEntity,
} from '@beep/contracts'
import {
  useCreateChannelInServerMutation,
  useGetCurrentStreamingUsersQuery,
  useGetServerChannelsQuery,
} from '@beep/server'
import { sortChannels } from '@beep/transmit'
import { UseModalProps, useModal } from '@beep/ui'
import { skipToken } from '@reduxjs/toolkit/query'
import {
  BaseSyntheticEvent,
  PropsWithChildren,
  createContext,
  useEffect,
  useRef,
} from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { CreateChannelModal } from '../../ui/create-channel-modal'
import { useHandleChangeChannel } from './handle-change-channel-hook'
import { useVoiceChannels } from './match-channel-hook'

interface ChannelContextInterface {
  streamingUsers: OccupiedChannelEntity[]
  channels: ChannelEntity[]
  createChannel: (
    e?: BaseSyntheticEvent<object, EventTarget, EventTarget>
  ) => void
  onClickId: (text: string) => void
  onJoinChannel: (channel: ChannelEntity) => void
  onLeaveVoiceChannel: () => void
  closeModal: () => void
  openCreateChannelModal: () => void
  openModal: React.Dispatch<React.SetStateAction<UseModalProps | undefined>>
  server?: ServerEntity
}

const defaultChannelContext: ChannelContextInterface = {
  streamingUsers: [],
  channels: [],
  createChannel: () => {
    return
  },
  onClickId: (_text: string) => {
    return
  },
  onJoinChannel: (_channel: ChannelEntity) => {
    return
  },
  onLeaveVoiceChannel: () => {
    return
  },
  closeModal: () => {
    return
  },
  openCreateChannelModal: () => {
    return
  },
  openModal: () => {
    return
  },
}

const ChannelContext = createContext<ChannelContextInterface>(
  defaultChannelContext
)

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ChannelsProviderProps {
  server?: ServerEntity
}

function ChannelsProvider({
  children,
  server,
}: PropsWithChildren<ChannelsProviderProps>) {
  useHandleChangeChannel({ server }) // if a user change voice channel it will be handled by this hook

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
  const { openModal, closeModal } = useModal() //channel creation modal
  const { t } = useTranslation()
  const { data: streamingUsers } = useGetCurrentStreamingUsersQuery(
    server?.id ?? skipToken
  )
  const [createChannel, resultCreatedChannel] =
    useCreateChannelInServerMutation()
  const methodsAddChannel = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      type: ChannelType.text_server,
    },
  })
  const { onJoinVoiceChannel, onLeaveVoiceChannel } = useVoiceChannels({
    streamingUsers,
    server,
  })

  const onClickId = async (text: string) => {
    await navigator.clipboard.writeText(text)
    toast.success(t('layout.channels-navigation.copy_server_id'))
  }

  const { data: channelsResponse } = useGetServerChannelsQuery(
    server?.id ?? skipToken
  )

  const channels: ChannelEntity[] = sortChannels(channelsResponse)
  const navigate = useNavigate()

  useEffect(() => {
    if (
      resultCreatedChannel.isSuccess &&
      resultCreatedChannel.data !== undefined
    ) {
      toast.success(t('layout.channels-navigation.success_create_channel'))
    } else if (resultCreatedChannel.isError) {
      toast.error(t('layout.channels-navigation.error_create_channel'))
    }
  }, [resultCreatedChannel, t])

  const onCreateChannel = methodsAddChannel.handleSubmit((data) => {
    const createChannelRequest: CreateChannelRequest = {
      serverId: server?.id ?? '',
      name: data.name,
      type: data.type,
    }
    createChannel(createChannelRequest)
    closeModal()
  })

  const onJoinTextChannel = (channel: ChannelEntity) => {
    navigate(`/servers/${server?.id}/channels/${channel.id}`)
  }

  const onJoinChannel = async (channel: ChannelEntity) => {
    switch (channel.type) {
      case ChannelType.voice_server:
        onJoinVoiceChannel(channel)
        break
      default:
        onJoinTextChannel(channel)
    }
  }

  return (
    <ChannelContext.Provider
      value={{
        streamingUsers: streamingUsers ?? [],
        channels,
        onClickId,
        closeModal,
        openCreateChannelModal,
        onJoinChannel,
        createChannel: onCreateChannel,
        onLeaveVoiceChannel,
        openModal,
        server,
      }}
    >
      {children}
    </ChannelContext.Provider>
  )
}

export { ChannelContext, ChannelsProvider }
