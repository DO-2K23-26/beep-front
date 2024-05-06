import { UserEntity } from '@beep/contracts'
import CurrentUser from '../ui/current-user'
import { useModal } from '@beep/ui'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { getUserState, useFetchProfilePictureQuery } from '@beep/user';

const onMicrophone = () => {
  console.log('Microphone')
}

const onPhone = () => {
  console.log('Phone')
}

export default function CurrentUserFeature() {
  const { tokens, isLoading, isAuthenticated, payload } = useSelector(getUserState)

  const { openModal, closeModal } = useModal()

  const currentUser: UserEntity = payload ? {
    id: payload.sub,
    email: payload.email,
    username: payload.username,
    firstname: payload.firstName,
    lastname: payload.lastName,
    profilePicture: useFetchProfilePictureQuery(payload.sub).currentData || '/picture.svg',
    verifiedAt: new Date(),
  } : {
    id: '1',
    email: 'rapidement@gmail.com',
    username: 'rapidement',
    firstname: 'Dorian',
    lastname: 'Grasset',
    profilePicture: '/picture.svg',
    verifiedAt: new Date(),
  }

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
