import {
  ChannelEntity,
  ChannelType,
  MessageEntity,
  UserEntity,
} from '@beep/contracts'
import { FormProvider, useForm } from 'react-hook-form'
import { PageChannel } from '../ui/page-channel'

const onSend = () => {
  console.log('Send message')
}

const onFiles = () => {
  console.log('Files')
}

export function PageChannelFeature() {
  const methods = useForm({
    mode: 'onChange',
  })
  return (
    <FormProvider {...methods}>
      <PageChannel
        messages={messages}
        channel={channel}
        onSend={onSend}
        onFiles={onFiles}
      />
    </FormProvider>
  )
}

const user: UserEntity = {
  id: '1',
  email: 'rapidement@gmail.com',
  username: 'Rapidement',
  firstname: 'Dorian',
  lastname: 'Grasset',
  profilePicture: '/picture.svg',
}

const messages: MessageEntity[] = [
  {
    id: '1',
    ownerId: '1',
    content: 'Prod Message',
    channelId: '1',
    createdAt: '2021-09-20',
    owner: user,
  },
  {
    id: '2',
    ownerId: '1',
    content: 'Prod Message',
    channelId: '1',
    createdAt: '2021-09-20',
    owner: user,
  },
  {
    id: '3',
    ownerId: '1',
    content: 'Prod Message',
    channelId: '1',
    createdAt: '2021-09-20',
    owner: user,
  },
  {
    id: '4',
    ownerId: '1',
    content: 'Prod Message',
    channelId: '1',
    createdAt: '2021-09-20',
    owner: user,
  },
  {
    id: '5',
    ownerId: '1',
    content: 'Prod Message',
    channelId: '1',
    createdAt: '2021-09-20',
    owner: user,
  },
  {
    id: '6',
    ownerId: '1',
    content: 'Prod Message',
    channelId: '1',
    createdAt: '2021-09-20',
    owner: user,
  },
  {
    id: '7',
    ownerId: '1',
    content: 'Prod Message',
    channelId: '1',
    createdAt: '2021-09-20',
    owner: user,
  },
  {
    id: '8',
    ownerId: '1',
    content: 'Prod Message',
    channelId: '1',
    createdAt: '2021-09-20',
    owner: user,
  },
  {
    id: '9',
    ownerId: '1',
    content: 'Prod Message',
    channelId: '1',
    createdAt: '2021-09-20',
    owner: user,
  },
  {
    id: '10',
    ownerId: '1',
    content: 'Prod Message',
    channelId: '1',
    createdAt: '2021-09-20',
    owner: user,
  },
]

const channel: ChannelEntity = {
  id: '1',
  name: '418 I am a teapot',
  server_id: '1',
  type: ChannelType.TEXT,
}