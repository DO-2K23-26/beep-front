import { ServerEntity } from '@beep/contracts'
import ServersNavigation from '../ui/servers-navigation'

const servers: ServerEntity[] = [
  {
    id: '@03248567',
    name: '418erreur',
    owner_id: 'Rapidement',
    picture: '/418.jpg',
  },
]

const onLogout = () => {
  console.log('Logout')
}

export default function ServersNavigationFeature() {
  return <ServersNavigation servers={servers} onLogout={onLogout} />
}
