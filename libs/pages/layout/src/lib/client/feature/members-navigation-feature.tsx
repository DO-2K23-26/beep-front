import { UserEntity } from '@beep/contracts'
import { useModal } from '@beep/ui'
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

const inviteCode = 'beep/invite/3421eg34ssa34y3'

export default function MembersNavigationFeature() {
  const { openModal, closeModal } = useModal()

  const onInviteMember = () => {
    console.log('Invite member')
    closeModal()
  }
  return (
    <MembersNavigation
      users={users}
      onInviteMember={onInviteMember}
      openModal={openModal}
      closeModal={closeModal}
      inviteCode={inviteCode}
    />
  )
}
