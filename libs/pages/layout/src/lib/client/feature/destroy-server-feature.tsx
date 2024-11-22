import {
  getServersState,
  serverActions,
  useDeleteServerMutation,
  useGetMyServersQuery,
} from '@beep/server'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DestroyServerModal from '../ui/server-settings-modal/delete-server-modal'
import { useNavigate } from 'react-router'
import { ServerEntity } from '@beep/contracts'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

interface DestroyServerFeatureProps {
  closeModal: () => void
}

export default function DestroyServerFeature({
  closeModal,
}: DestroyServerFeatureProps) {
  const { t } = useTranslation()

  const [confirmation, setConfirmation] = useState('')
  const focusedServer = useSelector(getServersState).server
  const [deleteServer] = useDeleteServerMutation()
  const [error, setError] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { data: availableServers } = useGetMyServersQuery()
  const dispatch = useDispatch()

  const CONFIRMATION_TEXT =
    useSelector(getServersState).server?.name ??
    t('layout.destroy-server.default_server_name')

  const onSubmit = () => {
    setLoading(true)
    if (!focusedServer) {
      setError(t('layout.destroy-server.no_server_selected'))
      setLoading(false)
      return
    }
    if (confirmation !== CONFIRMATION_TEXT) {
      setError(t('layout.destroy-server.error_server_name_mismatch'))
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
      icon: '',
      visibility: 'private',
    }
    deleteServer(focusedServerId)
      .unwrap()
      .then(() => {
        setLoading(false)
        if (!availableServers) {
          dispatch(serverActions.setServer(emptyServer))
          toast.success(t('layout.destroy-server.success_delete_server'))
          closeModal()
          return
        }
        const serverToNavigate = availableServers.find(
          (server: ServerEntity) => server.id !== focusedServerId
        )
        if (!serverToNavigate) {
          dispatch(serverActions.setServer(emptyServer))
          toast.success(t('layout.destroy-server.success_delete_server'))
          closeModal()
          return
        }
        navigate('/discover')
        dispatch(serverActions.setServer(serverToNavigate))
        toast.success(t('layout.destroy-server.success_delete_server'))
        closeModal()
      })
      .catch((err) => {
        setError(t('layout.destroy-server.error_delete_server'))
        setLoading(false)
        toast.error(t('layout.destroy-server.error_delete_server'))
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
