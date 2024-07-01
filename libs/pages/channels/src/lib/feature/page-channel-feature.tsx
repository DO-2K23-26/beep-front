import {
  useCreateMessageMutation,
  useDeleteMessageMutation,
  useGetChannelQuery,
  useGetMessagesByChannelIdQuery,
  useUpdateMessageMutation,
} from '@beep/channel'
import { useGetServerChannelsQuery } from '@beep/server'
import { skipToken } from '@reduxjs/toolkit/query'
import {
  ChannelEntity,
  ChannelType,
  backendUrl,
  UserDisplayedEntity,
} from '@beep/contracts'
import { responsiveActions } from '@beep/responsive'
import { useGetUsersByServerIdQuery } from '@beep/server'
import { AppDispatch } from '@beep/store'
import { DynamicSelectorProps, useModal } from '@beep/ui'
import { useEffect, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router'
import { PageChannel } from '../ui/page-channel'
import { DynamicSelectorFeature } from './dynamic-selector-item-feature'
import { DynamicSelectorChannelFeature } from './dynamic-selector-channel-feature'
import { TransmitSingleton } from '@beep/utils'
import { DeleteMessageModal } from '../ui/delete-message-modal'
import { useGetUserByIdQuery } from '@beep/user'
import { useFetchProfilePictureQuery } from '@beep/user'

export function PageChannelFeature() {
  const { serverId = '', channelId = '' } = useParams<{
    serverId: string
    channelId: string
  }>()
  const { data: channels } = useGetServerChannelsQuery(serverId)
  const { data: channel } = useGetChannelQuery({
    serverId: serverId,
    channelId: channelId,
  })
  const {
    data: messages,
    refetch,
    isSuccess,
  } = useGetMessagesByChannelIdQuery({ channelId })
  const { data: usersServer } = useGetUsersByServerIdQuery(serverId)
  const { openModal, closeModal } = useModal()
  const [files, setFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<{ content: string | null }[]>(
    []
  )

  const [selectedTaggedChannel, setSelectedTaggedChannel] = useState<
    ChannelEntity | undefined
  >(undefined)

  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedTaggedUser, setSelectedTaggedUser] = useState<
    UserDisplayedEntity | undefined
  >(undefined)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [createMessage] = useCreateMessageMutation()

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      message: '',
      replyTo: null
    }
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

    if (currentWord[0] !== '@' && currentWord[0] !== '#') {
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
                u.username
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
          title: 'Users',
          elements: elements,
          maxElements: 5,
          emptyMessage: 'Any user.',
          onSelect: (id) => {
            methods.setValue(
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
        title: 'Text channels',
        elements:
          channels
            ?.filter(
              (c: { type: ChannelType; name: string }) =>
                (c.type === ChannelType.TEXT &&
                  c.name.toLowerCase().includes(text.slice(1).toLowerCase())) ||
                text.slice(1) === ''
            )
            .map((channel) => ({
              id: channel.id,
              content: <DynamicSelectorChannelFeature channel={channel} />,
            })) ?? [],
        maxElements: 5,
        emptyMessage: 'Any text channel.',
        onSelect: (id) => {
          methods.setValue(
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
      ? inputRef.current.selectionStart!
      : 0

    updateDynamicSelector(value, cursorPos)
  }

  const handleCursorChange = () => {
    if (inputRef.current) {
      const value = inputRef.current.value
      const cursorPos: number = inputRef.current
        ? inputRef.current.selectionStart!
        : 0

      updateDynamicSelector(value, cursorPos)
    }
  }

  const findChannelForTag = (tag: string): ChannelEntity | undefined => {
    if (channels) {
      return channels.find((c) => c.id === tag.slice(2))
    }
    return undefined
  }

  const findUserForTag = (tag: string): UserDisplayedEntity | undefined => {
    if (usersServer) {
      const user = usersServer.find((u) => u.id === tag.slice(2))
      if (user) {
        return user
      }
    }

    const responseUser = useGetUserByIdQuery(tag.slice(2))
    if (responseUser.data) {
      return responseUser.data
    }

    return undefined
  }

  const dispatch = useDispatch<AppDispatch>()
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
    try {
      await updateMessage({
        channelId: channelId,
        messageId: messageId,
        content: newContent,
      }).unwrap()
    } catch (error) {
      console.error('Error updating message')
    }
  }

  const [deleteMessage] = useDeleteMessageMutation()

  const onDeleteMessage = async (channelId: string, messageId: string) => {
    try {
      openModal({
        content: (
          <DeleteMessageModal
            closeModal={closeModal}
            onDeleteMessage={async () => {
              await deleteMessage({
                channelId: channelId,
                messageId: messageId,
              }).unwrap()
              closeModal()
            }}
          />
        ),
      })
    } catch (error) {
      toast.error('Failure while trying to delete the message')
    }
  }

  const onSendMessage = methods.handleSubmit(async (data) => {
    // check if message is not empty OR files are not empty
    if (
      'message' in data &&
      ((data.message !== '' && data.message !== undefined) || files.length > 0)
    ) {
      // create a form data object for the http request
      const formData: FormData = new FormData()

      // set the content of the message -> { content: data.message }
      formData.set(
        'content',
        data.message === '' || data.message === undefined ? ' ' : data.message
      )

      // if files are present, append them to the form data object
      if (files.length > 0) {
        formData.set('attachments', JSON.stringify([]))
        files.forEach((file, i) => {
          formData.append(`attachments[${i}]`, file)
        })
      }

      formData.set('parentMessageId', data.replyTo || '')

      // send the http request to the server and create a new message
      createMessage({
        channelId: channelId,
        body: formData,
      })

      // reset the form
      methods.setValue('message', '')
      methods.setValue('replyTo', null)
      setFiles([])
    } else {
      toast.error('A message is required')
    }
  })

  useEffect(() => {
    TransmitSingleton.subscribe(`channels/${channelId}/message`, (message) => {
      refetch()
    })
  }, [channelId, refetch, isSuccess])

  return messages !== undefined && channel !== undefined ? (
    <FormProvider {...methods}>
      <PageChannel
        messages={messages}
        channel={{
          id: channel.id,
          name: channel.name,
          serverId: channelId,
          type: ChannelType.TEXT,
        }}
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
        findChannelForTag={findChannelForTag}
        selectedTaggedChannel={selectedTaggedChannel}
        setSelectedTaggedChannel={setSelectedTaggedChannel}
        findUserForTag={findUserForTag}
        selectedTaggedUser={selectedTaggedUser}
        setSelectedTaggedUser={setSelectedTaggedUser}
      />
    </FormProvider>
  ) : (
    <p>Data is loading... Beboup beboup</p>
  )
}
