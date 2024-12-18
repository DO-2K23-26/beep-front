import { useDeleteServerMutation, useGetMyServersQuery } from '@beep/server'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import DestroyServerModal from '../ui/server-settings-modal/delete-server-modal'

interface DestroyServerFeatureProps {
  serverId: string
  closeModal: () => void
  navigateAfterDelete: () => void
}

export default function DestroyServerFeature({
  serverId,
  closeModal,
  navigateAfterDelete,
}: DestroyServerFeatureProps) {
  const { t } = useTranslation()
  const { server } = useGetMyServersQuery(undefined, {
    selectFromResult: ({ data, isError }) => {
      if (isError && data === undefined) {
        closeModal()
        navigateAfterDelete()
      }
      if (!data) {
        return { server: undefined }
      }
      return { server: data.find((s) => s.id === serverId) }
    },
  })
  const [confirmation, setConfirmation] = useState('')
  const [deleteServer, deleteServerResult] = useDeleteServerMutation()
  const [error, setError] = useState<string | undefined>(undefined)
  const CONFIRMATION_TEXT =
    server?.name ?? t('layout.destroy-server.default_server_name')
  const onSubmit = () => {
    if (!serverId) {
      closeModal()
      navigateAfterDelete()
      return
    }
    if (confirmation !== CONFIRMATION_TEXT) {
      setError(t('layout.destroy-server.error_server_name_mismatch'))
      return
    }
    deleteServer(serverId)
  }

  useEffect(() => {
    if (deleteServerResult.isError) {
      setError(t('layout.destroy-server.error_delete_server'))
      toast.error(t('layout.destroy-server.error_delete_server'))
    } else if (deleteServerResult.isSuccess) {
      closeModal()
      navigateAfterDelete()
      toast.success(t('layout.destroy-server.success_delete_server'))
    }
  }, [closeModal, deleteServerResult, navigateAfterDelete, t])

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
      loading={deleteServerResult.isLoading}
    />
  )
}
