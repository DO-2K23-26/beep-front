import { ServerEntity } from '@beep/contracts'
import ServersNavigation from '../ui/servers-navigation'
import { useModal } from '@beep/ui'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { userActions } from '@beep/user'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@beep/store'

const servers: ServerEntity[] = [
  {
    id: '@03248567',
    name: '418erreur',
    owner_id: 'Rapidement',
    picture: '/418.jpg',
  },
]



const onPrivateMessage = (navigation: NavigateFunction) => {
  navigation('/servers/@me')

}

export default function ServersNavigationFeature() {
  const { openModal, closeModal } = useModal()
  const dispatch = useDispatch<AppDispatch>()


  const onLogout = (navigation: NavigateFunction) => {
    sessionStorage.removeItem('accessToken')
    sessionStorage.removeItem('refreshToken')
    dispatch(userActions.setTokens({}))
    toast.success('Successfully logged out !')
    navigation('/authentication/signin')
  }



  const navigate = useNavigate()

  const methodsAddChannel = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
    },
  })
  

  const onCreateServer = methodsAddChannel.handleSubmit((data) => {
    console.log('Create server')
    toast.success('Server created !')
    closeModal()
  })
  return (
    <ServersNavigation
      servers={servers}
      onLogout={() => onLogout(navigate)}
      onPrivateMessage={() => onPrivateMessage(navigate)}
      onCreateServer={onCreateServer}
      openModal={openModal}
      closeModal={closeModal}
      methods={methodsAddChannel}
    />
  )
}
