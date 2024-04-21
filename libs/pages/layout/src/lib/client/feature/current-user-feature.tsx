import { UserEntity } from '@beep/contracts'
import CurrentUser from '../ui/current-user'

const currentUser: UserEntity = {
  id: '1',
  email: 'rapidement@gmail.com',
  username: 'Rapidement',
  firstname: 'Dorian',
  lastname: 'Grasset',
  profilePicture: '/picture.svg',
}

const onMicrophone = () => {
  console.log('Microphone')
}

const onPhone = () => {
  console.log('Phone')
}

const onSettings = () => {
  console.log('Settings')
}

export default function CurrentUserFeature() {
  return (
    <CurrentUser
      user={currentUser}
      onMicrophone={onMicrophone}
      onPhone={onPhone}
      onSettings={onSettings}
    />
  )
}
