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

export default function CurrentUserFeature() {
  return <CurrentUser user={currentUser} />
}
