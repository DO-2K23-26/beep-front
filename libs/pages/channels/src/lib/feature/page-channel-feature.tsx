import {
  useDeleteMessageMutation,
  useGetMessagesByChannelIdQuery,
  useUpdateMessageMutation,
} from '@beep/channel'
import {
  ActionSignalMessage,
  ChannelEntity,
  MessageEntity,
  ServerEntity,
  SignalMessage,
  UserDisplayedEntity,
} from '@beep/contracts'
import { messageActions } from '@beep/message'
import { responsiveActions } from '@beep/responsive'
import {
  serverActions,
  useGetChannelQuery,
  useGetMembersQuery,
  useGetMyServersQuery,
  useGetServerChannelsQuery,
} from '@beep/server'
import { AppDispatch, RootState } from '@beep/store'
import { DynamicSelectorProps, useModal } from '@beep/ui'
import { useGetMeQuery } from '@beep/user'
import { TransmitSingleton } from '@beep/utils'
import { skipToken } from '@reduxjs/toolkit/query'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { DeleteMessageModal } from '../ui/delete-message-modal'
import { PageChannel } from '../ui/page-channel'
import { DynamicSelectorChannelFeature } from './dynamic-selector-channel-feature'
import { DynamicSelectorFeature } from './dynamic-selector-item-feature'
import { useTranslation } from 'react-i18next'

export function PageChannelFeature() {
  const { t } = useTranslation()

  const dispatch = useDispatch<AppDispatch>()
  const limit = 50
  const { data: user } = useGetMeQuery()
  const { serverId = '', channelId = '' } = useParams<{
    serverId: string
    channelId: string
  }>()
  const messageListRef = useRef<HTMLDivElement>(null)

  const { data: channels } = useGetServerChannelsQuery(serverId)
  const { data: channel, isLoading: isLoadingChannel } = useGetChannelQuery({
    serverId: serverId,
    channelId: channelId,
  })
  const { data: availableServers } = useGetMyServersQuery()
  const [fetchBeforeId, setFetchBeforeId] = useState<string | null>(null)

  const {
    isLoading: isLoadingMessages,
    isSuccess: isSuccessGetMessage,
    isFetching: isFetchingMessage,
  } = useGetMessagesByChannelIdQuery(
    { channelId, before: fetchBeforeId, limit },
    {
      refetchOnFocus: true,
      skip: channelId === undefined,
      refetchOnMountOrArgChange: true,
    }
  )

  useEffect(() => {
    setFetchBeforeId(null)
  }, [channelId])

  const messageState = useSelector(
    (state: RootState) => state.message.channels_messages[channelId]
  )
  const { data: usersServer } = useGetMembersQuery(serverId ?? skipToken)
  const { openModal, closeModal } = useModal()
  const [files, setFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<{ content: string | null }[]>(
    []
  )
  const [selectedTaggedChannel, setSelectedTaggedChannel] = useState<
    ChannelEntity | undefined
  >(undefined)

  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [selectedTaggedUser, setSelectedTaggedUser] = useState<
    UserDisplayedEntity | undefined
  >(undefined)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)

  const messageForm = useForm({
    mode: 'onChange',
    defaultValues: {
      message: '',
      replyTo: null as MessageEntity | null,
    },
  })

  const [dynamicSelector, setDynamicSelector] = useState<
    DynamicSelectorProps | undefined
  >(undefined)

  const updateDynamicSelector = (message: string, cursorPos: number) => {
    const startWordIndex: number = message.slice(0, cursorPos).includes(' ')
      ? message.slice(0, cursorPos).lastIndexOf(' ') + 1
      : 0
    const endWordIndex: number = message.slice(cursorPos).includes(' ')
      ? message.indexOf(' ', cursorPos)
      : message.length

    const currentWord = message.slice(startWordIndex, endWordIndex)

    if (!currentWord.startsWith('@') && !currentWord.startsWith('#')) {
      setDynamicSelector(undefined)
      return
    }

    const nonUserTagRegex =
      /@(?!(\$[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}))/
    const nonChannelTagRegex =
      /#(?!(\$[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}))/

    const text: string = message.slice(startWordIndex, endWordIndex).trim()
    if (nonUserTagRegex.test(text)) {
      const elements = usersServer
        ? usersServer
            .filter(
              (u) =>
                u.nickname
                  .toLowerCase()
                  .includes(text.slice(1).toLowerCase()) || text.slice(1) === ''
            )
            .map((user) => ({
              id: user.id,
              content: <DynamicSelectorFeature user={user} />,
            }))
        : []

      if (elements.length === 0) {
        setDynamicSelector(undefined)
      } else {
        setDynamicSelector({
          title: t('channels.page-channel.user_selector.title'),
          elements: elements,
          maxElements: 5,
          emptyMessage: t('channels.page-channel.user_selector.empty_result'),
          onSelect: (id) => {
            messageForm.setValue(
              'message',
              message.slice(0, startWordIndex) +
                `@$${id}` +
                message.slice(endWordIndex)
            )
            setDynamicSelector(undefined)
          },
        })
      }
    } else if (nonChannelTagRegex.test(text)) {
      setDynamicSelector({
        title: t('channels.page-channel.channel_selector.title'),
        elements:
          channels?.textChannels
            .filter(
              (c) =>
                c.name.toLowerCase().includes(text.slice(1).toLowerCase()) ||
                text.slice(1) === ''
            )
            .map((channel) => ({
              id: channel.id,
              content: <DynamicSelectorChannelFeature channel={channel} />,
            })) ?? [],
        maxElements: 5,
        emptyMessage: t('channels.page-channel.channel_selector.empty_result'),
        onSelect: (id) => {
          messageForm.setValue(
            'message',
            message.slice(0, startWordIndex) +
              `#$${id}` +
              message.slice(endWordIndex)
          )
          setDynamicSelector(undefined)
        },
      })
    } else {
      setDynamicSelector(undefined)
    }
  }
  const onScrollMessage = () => {
    if (messageListRef.current && messageState !== undefined) {
      const { scrollTop, scrollHeight, clientHeight } = messageListRef.current

      if (
        ((scrollTop - clientHeight) / scrollHeight) * -1 >= 0.75 &&
        messageState?.[messageState.length - 1] !== undefined &&
        messageState?.length >= limit
      ) {
        setFetchBeforeId(messageState[messageState.length - 1].id ?? null)
      }
    }
  }

  const handleInputChange = (
    value: string,
    onChange: (value: string) => void
  ) => {
    onChange(value)
    if (value === undefined || value === '') return

    const cursorPos: number = inputRef.current
      ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        inputRef.current.selectionStart!
      : 0

    updateDynamicSelector(value, cursorPos)
  }

  const handleCursorChange = () => {
    if (inputRef.current) {
      const value = inputRef.current.value
      const cursorPos: number = inputRef.current
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          inputRef.current.selectionStart!
        : 0

      updateDynamicSelector(value, cursorPos)
    }
  }

  const hideRightDiv = () => {
    dispatch(responsiveActions.manageRightPane())
  }
  const hideLeftDiv = () => {
    dispatch(responsiveActions.manageLeftPane())
  }

  const onAddFile = (file: File) => {
    setFiles((prev) => [...prev, file])

    if (file.type.includes('image')) {
      const reader = new FileReader()

      reader.onloadend = () => {
        setPreviewUrls((prev) => [
          ...prev,
          { content: reader.result as string },
        ])
      }
      reader.readAsDataURL(file)
    } else {
      setPreviewUrls((prev) => [...prev, { content: null }])
    }
  }

  const onDeleteFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const [updateMessage] = useUpdateMessageMutation()

  const onUpdateMessage = async (messageId: string, newContent: string) => {
    await updateMessage({
      channelId: channelId,
      messageId: messageId,
      content: newContent,
    }).unwrap()
  }

  const [deleteMessage, resultDeleteMessage] = useDeleteMessageMutation()

  const onDeleteMessage = async (channelId: string, messageId: string) => {
    openModal({
      content: (
        <DeleteMessageModal
          closeModal={closeModal}
          onDeleteMessage={async () => {
            await deleteMessage({
              channelId: channelId,
              messageId: messageId,
            }).unwrap()
          }}
        />
      ),
    })
  }

  useEffect(() => {
    if (resultDeleteMessage.isError) {
      toast.error(t('channels.page-channel.error.delete_message'))
    }
  }, [resultDeleteMessage])

  const onSendMessage = messageForm.handleSubmit(async (data) => {
    // check if message is not empty OR files are not empty

    if (
      'message' in data &&
      ((data.message !== '' && data.message !== undefined) || files.length > 0)
    ) {
      dispatch(
        messageActions.send({
          channelId: channelId,
          files: files,
          message: data.message,
          replyTo: data.replyTo,
          userId: user?.id ?? '',
        })
      )

      // reset the form
      messageForm.reset()
      setFiles([])
    } else {
      toast.error(t('channels.page-channel.error.empty_message'))
    }
  })

  useEffect(() => {
    TransmitSingleton.subscribe(`channels/${channelId}/messages`, (data) => {
      const signal: SignalMessage = JSON.parse(data)
      switch (signal.action) {
        case ActionSignalMessage.create:
          dispatch(
            messageActions.create({
              message: signal.message,
              transmitClientId: signal.transmitClientId,
            })
          )
          break
        case ActionSignalMessage.update:
          dispatch(messageActions.update(signal.message))
          break
        case ActionSignalMessage.delete:
          dispatch(messageActions.delete(signal.message))
          break
        default:
          break
      }
    })
    if (availableServers) {
      const curServer = availableServers.find(
        (s: ServerEntity) => s.id === serverId
      ) ?? {
        id: '',
        name: 'You have no servers',
        createdAt: '',
        updatedAt: '',
        ownerId: '',
        icon: '',
        visibility: 'private',
      }
      dispatch(serverActions.setServer(curServer))
    }
    return () => {
      TransmitSingleton.unsubscribeChannel(`channels/${channelId}/messages`)
    }
  }, [serverId, isSuccessGetMessage, availableServers, dispatch, channelId])

  return (
    <PageChannel
      key={'page_channel' + channelId}
      messageForm={messageForm}
      serverId={serverId}
      messages={messageState ?? []}
      channel={channel}
      messageListRef={messageListRef}
      onScrollMessage={onScrollMessage}
      sendMessage={onSendMessage}
      onUpdateMessage={onUpdateMessage}
      onDeleteMessage={onDeleteMessage}
      files={files}
      filesPreview={previewUrls}
      onAddFiles={onAddFile}
      onDeleteFile={onDeleteFile}
      hideRightDiv={hideRightDiv}
      hideLeftDiv={hideLeftDiv}
      inputRef={inputRef}
      editingMessageId={editingMessageId}
      setEditingMessageId={setEditingMessageId}
      onChange={handleInputChange}
      onCursorChange={handleCursorChange}
      dynamicSelector={dynamicSelector}
      selectedTaggedChannel={selectedTaggedChannel}
      setSelectedTaggedChannel={setSelectedTaggedChannel}
      selectedTaggedUser={selectedTaggedUser}
      setSelectedTaggedUser={setSelectedTaggedUser}
      isLoadingMessages={isLoadingMessages || isFetchingMessage}
      isLoadingChannel={isLoadingChannel}
    />
  )
}
