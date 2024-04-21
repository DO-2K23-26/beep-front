import { UserEntity } from '@beep/contracts'
import CurrentUser from '../ui/current-user'
import { useModal } from '@beep/ui'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

const currentUser: UserEntity = {
  id: '1',
  email: 'rapidement@gmail.com',
  username: 'rapidement',
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

export default function CurrentUserFeature() {
  const { openModal, closeModal } = useModal()

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      username: currentUser.username,
      email: currentUser.email,
      'actual-password': '',
      'new-password': '',
      'confirm-password': '',
    },
  })

  const onSaveParameters = methods.handleSubmit((data) => {
    console.log('Save parameters')
    toast.success('Settings updated !')
    closeModal()
  })

  return (
    <CurrentUser
      user={currentUser}
      onMicrophone={onMicrophone}
      onPhone={onPhone}
      onSaveParameters={onSaveParameters}
      openModal={openModal}
      closeModal={closeModal}
      methods={methods}
    />
  )
}
