import {
  getServersState,
  serverActions,
  useDeleteServerMutation,
  useGetServersQuery,
} from '@beep/server'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DestroyServerModal from '../ui/server-settings-modal/delete-server-modal'
import { useNavigate } from 'react-router'
import { ServerEntity } from '@beep/contracts'
import toast from 'react-hot-toast'

interface DestroyServerFeatureProps {
  closeModal: () => void
}

//TODO : finish this tomorrow
export default function DestroyServerFeature({
  closeModal,
}: DestroyServerFeatureProps) {
  const [confirmation, setConfirmation] = useState('')
  const focusedServer = useSelector(getServersState).server
  const [deleteServer] = useDeleteServerMutation()
  const [error, setError] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { data: availableServers } = useGetServersQuery()
  const dispatch = useDispatch()

  const CONFIRMATION_TEXT =
    useSelector(getServersState).server?.name ?? 'Your server name'

  const onSubmit = () => {
    setLoading(true)
    if (!focusedServer) {
      setError('No server selected')
      setLoading(false)
      return
    }
    if (confirmation !== CONFIRMATION_TEXT) {
      setError('Confirmation text does not match')
      setLoading(false)
      return
    }
    const focusedServerId = focusedServer.id
    const emptyServer: ServerEntity = {
      id: '',
      name: 'You have no servers',
      createdAt: '',
      updatedAt: '',
      ownerId: '',
      picture: '',
      visibility: 'private',
    }
    deleteServer(focusedServerId)
      .unwrap()
      .then(() => {
        setLoading(false)
        if (!availableServers) {
          //TODO: replace it with discovery page once its done
          dispatch(serverActions.setServer(emptyServer))
          navigate('/servers/@me')
          toast.success('Server deleted successfully')
          closeModal()
          return
        }
        const serverToNavigate = availableServers.find(
          (server) => server.id !== focusedServerId
        )
        if (!serverToNavigate) {
          dispatch(serverActions.setServer(emptyServer))
          navigate('/servers/@me')
          toast.success('Server deleted successfully')
          closeModal()
          return
        }
        dispatch(serverActions.setServer(serverToNavigate))
        toast.success('Server deleted successfully')
        closeModal()
      })
      .catch((err) => {
        setError('An error occured while deleting the server')
        setLoading(false)
        toast.error('An error occured while deleting the server')
      })
  }

  return (
    <DestroyServerModal
      value={confirmation}
      onChange={(e) => {
        setConfirmation(e.target.value)
        setError(undefined)
      }}
      onSubmit={onSubmit}
      closeModal={closeModal}
      confirmationWord={CONFIRMATION_TEXT}
      error={error}
      loading={loading}
    />
  )
}
