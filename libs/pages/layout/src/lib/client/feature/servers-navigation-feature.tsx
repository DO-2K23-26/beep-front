import {
  useGetMyServersQuery,
  useLeaveVoiceChannelMutation,
} from '@beep/server'
import { AppDispatch, resetStore } from '@beep/store'
import { useModal } from '@beep/ui'
import { useLogoutMutation } from '@beep/user'
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
  const [logout] = useLogoutMutation()

  const navigate = useNavigate()
  const onLogout = () => {
    leaveServer()
    dispatch({ type: 'CLOSE_WEBRTC' })
    dispatch(resetStore())
    logout()
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
