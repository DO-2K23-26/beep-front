import { Transmit } from '@adonisjs/transmit-client'
import {
  useCreateMessageMutation,
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
  const { channelId = '' } = useParams<{ channelId: string }>()
  const { data: response, refetch } = useGetMessagesByChannelIdQuery({
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
    if ('message' in data && (data.message !== '' || files.length > 0)) {
      const formData = new FormData()
      if (files.length > 0) {
        files.forEach((file, i) => {
          formData.append(`attachments[${i}]`, file)
        })
      }
      createMessage({
        channelId: channelId,
        content: data.message,
        attachments: formData,
      })
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
      console.log('NEW MESSAGE :', message)
      refetch()
    })
  }, [])

  return (
    <FormProvider {...methods}>
      {response ? (
        <PageChannel
          messages={response.messages}
          channel={{
            id: response.id,
            name: response.name,
            server_id: channelId,
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
      ) : (
        <p>Data is loading... Beboup beboup</p>
      )}
    </FormProvider>
  )
}
