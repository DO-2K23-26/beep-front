import { UserEntity } from '@beep/contracts'
import MembersNavigation from '../ui/members-navigation'

const users: UserEntity[] = [
  {
    id: '1',
    email: 'rapidement@gmail.com',
    username: 'Rapidement',
    firstname: 'Dorian',
    lastname: 'Grasset',
    profilePicture: '/picture.svg',
  },
]

const onInviteMember = () => {
  console.log('Invite member')
}

export default function MembersNavigationFeature() {
  return <MembersNavigation users={users} onInviteMember={onInviteMember} />
}
