import ServersNavigation from '../ui/servers-navigation'
import { useModal } from '@beep/ui'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { userActions } from '@beep/user'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@beep/store'
import { useGetServersQuery, useJoinServerMutation, useCreateServerMutation } from '@beep/server'


const onPrivateMessage = (navigation: NavigateFunction) => {
  navigation('/servers/@me')
}

export default function ServersNavigationFeature() {
  const { data: servers } = useGetServersQuery()
  const [createServer] = useCreateServerMutation()
  const [joinServer ] = useJoinServerMutation()
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
    createServer(data.name)
    closeModal()
  })

  const onJoinServer = (serverId: string) => {
    joinServer(serverId)
    closeModal()
  }

  return (
    <ServersNavigation
      servers={servers}
      onLogout={() => onLogout(navigate)}
      onPrivateMessage={() => onPrivateMessage(navigate)}
      onCreateServer={onCreateServer}
      onJoinServer={onJoinServer}
      openModal={openModal}
      closeModal={closeModal}
      methods={methodsAddChannel}
    />
  )
}
