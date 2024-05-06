import {
  ChannelType,
  backendUrl,
} from '@beep/contracts'
import { FormProvider, useForm } from 'react-hook-form'
import { PageChannel } from '../ui/page-channel'
import { useParams } from 'react-router'
import { useCreateMessageMutation, useDeleteMessageMutation, useGetMessagesByChannelIdQuery, useUpdateMessageMutation } from '@beep/channel'
import { useEffect, useState } from 'react'
import { Transmit } from "@adonisjs/transmit-client";
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { responsiveActions } from '@beep/responsive'
import { AppDispatch } from '@beep/store'

export function PageChannelFeature() {
  const { channelId = '' } = useParams<{ channelId: string }>()
  const { data: response, refetch } = useGetMessagesByChannelIdQuery(channelId)

  const [files, setFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<{ content: string | null }[]>([]);

  const [ createMessage, result ] = useCreateMessageMutation()
  const [ updateMessage, resultUpdate ] = useUpdateMessageMutation()
  const [ deleteMessage, resultDelete ] = useDeleteMessageMutation()

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
    setFiles(prev => [...prev, file])

    if (file.type.includes('image')) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreviewUrls(prev => [...prev, { content: reader.result as string }]);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrls(prev => [...prev, { content: null }]);
    }

  }

  const onDeleteFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  const onSendMessage = methods.handleSubmit((data) => {
    if ('message' in data && (data.message !== '' || files.length > 0)) {
      const formData = new FormData()
      formData.append('content', data.message ?? ' ')
      if (files.length > 0) {
        files.forEach((file, i) => {
          formData.append(`attachments[${i}]`, file)
        })
      }

      formData.append('channelId', channelId)
      createMessage(formData)

      methods.setValue('message', '')
      setFiles([])
    } else {
      toast.error('A message is required')
    }
  })

  methods.handleSubmit((data) => {
    console.log(data)
    // if ('message' in data && data["message-" + messageId] !== '') {
    //   const messageForm = data["message-" + messageId]

    //   updateMessage({
    //     id: messageId,
    //     content: messageForm,
    //     attachments: []
    //   })

    //   methods.setValue(('message-' + messageId), '')
    // } else {
    //   toast.error('A message is required')
    // }
  })

  useEffect(() => {
    const transmit = new Transmit({
      baseUrl: backendUrl,
    })

    const result = transmit.subscription(`channels/${channelId}/messages`)
    result.onMessage((message) => {
      refetch()
    })
  }, []);

  return (
    <FormProvider {...methods}>
      {
        response ? (
          <PageChannel
            messages={response.messages}
            channel={{ id: response.id, name: response.name, server_id: channelId, type: ChannelType.TEXT }}
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
        )
      }

    </FormProvider>
  )
}
