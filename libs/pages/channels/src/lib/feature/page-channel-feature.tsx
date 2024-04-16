import { MessageEntity } from '@beep/contracts'
// import { channelApi, useGetMessagesByChannelIdQuery } from '@beep/domains/channels';
import { useParams } from 'react-router-dom'
import { MessageFormValues, PageChannel } from '../ui/page-channel'

const messages: MessageEntity[] = [
  {
    id: 'fkremifjewiofj',
    ownerId: 'fmjerwnfruif',
    content: 'Hello',
    channelId: 'fiejfriofj',
  },
]

export function PageChannelFeature() {
  //recuperer les messages du channel dont l'id est numChannel
  const { channelId = '' } = useParams<{ channelId: string }>()

  // const { data: channel, refetch } = useGetMessagesByChannelIdQuery(channelId)
  // const [createMessage, _] = channelApi.endpoints.createMessage.useMutation();

  const sendMessage = (data: MessageFormValues) => {
    const formadata = new FormData()
    formadata.append('content', data.content)
    if (data.files) {
      for (let i = 0; i < data.files.length; i++) {
        formadata.append('attachments[' + i + ']', data.files[i])
      }
    }
    formadata.append('channelId', channelId)
    console.log(formadata.getAll('attachments'))
    // createMessage(formadata)
  }

  return (
    <PageChannel
      channelId={channelId}
      messages={messages}
      sendMessage={sendMessage}
    />
  )
}
