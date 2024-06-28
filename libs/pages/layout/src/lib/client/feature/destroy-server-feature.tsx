import { getServersState, useDeleteServerMutation } from '@beep/server'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DestroyServerModal from '../ui/server-settings-modal/delete-server-modal'
import { useNavigate } from 'react-router'

interface DestroyServerFeatureProps {
  closeModal: () => void
}

//TODO : finish this tomorrow
export default function DestroyServerFeature({
  closeModal,
}: DestroyServerFeatureProps) {
  const [confirmation, setConfirmation] = useState('')
  const focusedServer = useSelector(getServersState).server?.id
  const [deleteServer, result] = useDeleteServerMutation()
  const [error, setError] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const availableServers = useSelector(getServersState).entities
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
    deleteServer(focusedServer)
      .unwrap()
      .then(() => {
        setLoading(false)
        const serverToNavigate = availableServers[0].id
        // dispatch('servers/set', serverToNavigate)
        closeModal()
      })
      .catch((err) => {
        setError('An error occured while deleting the server')
        setLoading(false)
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
