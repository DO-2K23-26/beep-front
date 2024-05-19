import { Transmit } from '@adonisjs/transmit-client'
import {
  useCreateMessageMutation,
  useGetChannelQuery,
  useGetMessagesByChannelIdQuery
} from '@beep/channel'
import { ChannelType, backendUrl } from '@beep/contracts'
import { responsiveActions } from '@beep/responsive'
import { AppDispatch } from '@beep/store'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router'
import { PageChannel } from '../ui/page-channel'

export function PageChannelFeature() {
  const { serverId = '', channelId = '' } = useParams<{ serverId: string, channelId: string }>()
  const { data: channel } = useGetChannelQuery({ serverId: serverId, channelId: channelId }) 
  const { data: messages, refetch } = useGetMessagesByChannelIdQuery({
    channelId: channelId,
  })

  const [files, setFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<{ content: string | null }[]>(
    []
  )

  const [createMessage] = useCreateMessageMutation()

  const methods = useForm({
    mode: 'onChange',
  })

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

  const onSendMessage = methods.handleSubmit((data) => {
    // check if message is not empty OR files are not empty
    if ('message' in data && ((data.message !== '' && data.message !== undefined) || files.length > 0)) {
      // create a form data object for the http request
      const formData: FormData = new FormData()

      // set the content of the message -> { content: data.message }
      formData.set('content', data.message === '' || data.message === undefined ? ' ' : data.message)
      
      // if files are present, append them to the form data object
      if (files.length > 0) {
        formData.set('attachments', JSON.stringify([]))
        files.forEach((file, i) => {
          formData.append(`attachments[${i}]`, file)
        })
      }
      
      // send the http request to the server and create a new message
      createMessage({
        channelId: channelId,
        body: formData
      })

      // reset the form
      methods.setValue('message', '')
      setFiles([])
    } else {
      toast.error('A message is required')
    }
  })

  useEffect(() => {
    const transmit = new Transmit({
      baseUrl: backendUrl,
    })

    const subscription = transmit.subscription(`channels/${channelId}/messages`)

    subscription.create()
    subscription.onMessage((message) => {
      refetch()
    })
  }, [])

  return (
    messages !== undefined && channel !== undefined ? (
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
          onUpdateMessage={() => {}}
          files={files}
          filesPreview={previewUrls}
          onAddFiles={onAddFile}
          onDeleteFile={onDeleteFile}
          hideRightDiv={hideRightDiv}
          hideLeftDiv={hideLeftDiv}
        />
      </FormProvider>
    ) : (
      <p>Data is loading... Beboup beboup</p>
    )
  )
}
