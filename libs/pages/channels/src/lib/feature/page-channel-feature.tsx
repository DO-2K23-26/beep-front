import {
  ActionSignalMessage,
  MessageEntity,
  SignalMessage
} from '@beep/contracts'
import { messageActions } from '@beep/message'
import { responsiveActions } from '@beep/responsive'
import {
  useGetMembersQuery,
  useGetMyServersQuery,
  useGetServerChannelsQuery,
} from '@beep/server'
import { AppDispatch } from '@beep/store'
import { DynamicSelectorProps } from '@beep/ui'
import { useGetMeQuery } from '@beep/user'
import { TransmitSingleton } from '@beep/utils'
import { skipToken } from '@reduxjs/toolkit/query'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router'
import { PageChannel } from '../ui/page-channel'
import { DynamicSelectorChannelFeature } from './dynamic-selector-channel-feature'
import { DynamicSelectorFeature } from './dynamic-selector-item-feature'

export function PageChannelFeature() {
  const { t } = useTranslation()

  const dispatch = useDispatch<AppDispatch>()
  const { data: user } = useGetMeQuery()
  const { serverId, channelId = '' } = useParams<{
    serverId: string
    channelId: string
  }>()
  const { data: usersServer } = useGetMembersQuery(serverId ?? skipToken)
  const { data: channels } = useGetServerChannelsQuery(serverId ?? skipToken)
  const { data: availableServers } = useGetMyServersQuery()

  const [files, setFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<{ content: string | null }[]>(
    []
  )

  const inputRef = useRef<HTMLTextAreaElement>(null)

  const messageForm = useForm({
    mode: 'onChange',
    defaultValues: {
      message: '',
      replyTo: null as MessageEntity | null,
    },
  })

  const onFocusChannel = () => {
    dispatch(responsiveActions.hidePane())
  }
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
              id: user.userId,
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
    return () => {
      TransmitSingleton.unsubscribeChannel(`channels/${channelId}/messages`)
    }
  }, [serverId, availableServers, dispatch, channelId])

  return (
    <PageChannel
      key={'page_channel' + channelId}
      messageForm={messageForm}
      sendMessage={onSendMessage}
      files={files}
      filesPreview={previewUrls}
      onAddFiles={onAddFile}
      onDeleteFile={onDeleteFile}
      inputRef={inputRef}
      onChange={handleInputChange}
      onCursorChange={handleCursorChange}
      dynamicSelector={dynamicSelector}
      onFocusChannel={onFocusChannel}
    />
  )
}
