import { ChannelEntity, ChannelType } from '@beep/contracts'
import ChannelsNavigation from '../ui/channels-navigation'

const channels: ChannelEntity[] = [
  {
    id: '1',
    name: 'Salut les amis',
    server_id: '13',
    type: ChannelType.TEXT,
  },
  {
    id: '2',
    name: 'Nous sommes des salons vocaux',
    server_id: '13',
    type: ChannelType.TEXT,
  },
]

const server = {
  id: '@03248567',
  name: '418erreur',
  owner_id: 'Rapidement',
  picture: '/418.jpg',
}

const onAddChannel = () => {
  console.log('Add channel')
}

export default function ChannelsNavigationFeature() {
  return (
    <ChannelsNavigation
      channels={channels}
      server={server}
      onAddChannel={onAddChannel}
    />
  )
}
