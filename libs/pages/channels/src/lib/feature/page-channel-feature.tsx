import {
  ChannelType,
  backendUrl,
} from '@beep/contracts'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { PageChannel } from '../ui/page-channel'
import { useParams } from 'react-router'
import { useCreateMessageMutation, useGetMessagesByChannelIdQuery } from '@beep/channel'
import { useEffect } from 'react'
import { Transmit } from "@adonisjs/transmit-client";
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { responsiveActions } from '@beep/responsive'
import { AppDispatch } from '@beep/store'

export function PageChannelFeature() {
  const { channelId = '' } = useParams<{ channelId: string }>()
  const { data: response, refetch } = useGetMessagesByChannelIdQuery(channelId)

  const [ createMessage, result ] = useCreateMessageMutation()

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

  const onSend = methods.handleSubmit((data) => {
    if ('message' in data && data.message !== '') {
      const message = data.message
      createMessage({
        channelId: channelId,
        content: message,
        attachments: [],
      })
      data.message = ''
      data.setContent('')
    } else {
      toast.error('A message is required')
    }
  })
  
  const onFiles = () => {
    console.log('Send file')
  }

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
            sendMessage={onSend}
            onFiles={onFiles}
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