import { useLeaveVoiceChannelMutation } from '@beep/server'
import { AppDispatch, resetStore } from '@beep/store'
import { useModal } from '@beep/ui'
import { useGetMyServersQuery, userActions } from '@beep/user'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ServersNavigation from '../ui/servers-navigation'

const onPrivateMessage = () => {
  // navigation('/discover')
}

export function ServersNavigationFeature() {
  const { data: servers } = useGetMyServersQuery()
  const { openModal, closeModal } = useModal()
  const dispatch = useDispatch<AppDispatch>()
  const [leaveServer] = useLeaveVoiceChannelMutation()

  const navigate = useNavigate()
  const onLogout = () => {
    sessionStorage.removeItem('accessToken')
    sessionStorage.removeItem('refreshToken')
    dispatch(userActions.setTokens({}))
    dispatch({ type: 'CLOSE_WEBRTC' })
    leaveServer()
    dispatch(resetStore())
    toast.success('Successfully logged out !')
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
