import {
  useGetMyServersQuery,
  useLeaveVoiceChannelMutation,
} from '@beep/server'
import { AppDispatch, resetStore } from '@beep/store'
import { useModal } from '@beep/ui'
import { useLogoutMutation, userActions } from '@beep/user'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ServersNavigation from '../ui/servers-navigation'
import { useTranslation } from 'react-i18next'

const onPrivateMessage = () => {
  // navigation('/discover')
}

export function ServersNavigationFeature() {
  const { t } = useTranslation()

  const { data: servers } = useGetMyServersQuery()
  const { openModal, closeModal } = useModal()
  const dispatch = useDispatch<AppDispatch>()
  const [leaveServer] = useLeaveVoiceChannelMutation()
  const [logout] = useLogoutMutation()

  const navigate = useNavigate()
  const onLogout = () => {
    leaveServer()
    sessionStorage.removeItem('accessToken')
    sessionStorage.removeItem('refreshToken')
    dispatch(userActions.setTokens({}))
    dispatch({ type: 'CLOSE_WEBRTC' })
    dispatch(resetStore())
    logout()
    toast.success(t('layout.servers-navigation.logout'))
    navigate('/authentication/signin')
  }

  return (
    <ServersNavigation
      servers={servers}
      onLogout={onLogout}
      onPrivateMessage={onPrivateMessage}
      openModal={openModal}
      closeModal={closeModal}
    />
  )
}
