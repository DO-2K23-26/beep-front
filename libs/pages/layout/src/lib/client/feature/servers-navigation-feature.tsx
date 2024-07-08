import {
  useGetServersQuery
} from '@beep/server'
import { AppDispatch } from '@beep/store'
import { useModal } from '@beep/ui'
import { userActions } from '@beep/user'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import ServersNavigation from '../ui/servers-navigation'

const onPrivateMessage = (navigation: NavigateFunction) => {
  navigation('/servers/@me')
}

export function ServersNavigationFeature() {
  const { data: servers } = useGetServersQuery()
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

  return (
    <ServersNavigation
      servers={servers}
      onLogout={() => onLogout(navigate)}
      onPrivateMessage={() => onPrivateMessage(navigate)}
      openModal={openModal}
      closeModal={closeModal}
    />
  )
}
