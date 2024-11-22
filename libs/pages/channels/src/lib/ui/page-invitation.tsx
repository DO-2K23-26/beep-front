import { useEffect } from 'react'
import { useJoinPrivateServerMutation } from '@beep/server'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

export function PageInvitation() {
  const { t } = useTranslation()

  const { inviteId } = useParams<{ inviteId: string }>()
  const navigate = useNavigate()
  const [joinPrivateServer, { isLoading, isError, isSuccess, data, error }] =
    useJoinPrivateServerMutation()

  useEffect(() => {
    if (inviteId) {
      joinPrivateServer(inviteId)
    }
  }, [inviteId, joinPrivateServer])

  useEffect(() => {
    if (isError) {
      toast.error(t('channels.page-invitation.error'))
    }
    if (isSuccess && data) {
      toast.success(t('channels.page-invitation.success'))
      navigate(`/servers/${data.serverId}`)
    }
  }, [isError, isSuccess, data, error, navigate])

  return (
    <div className="bg-violet-200 w-full p-4">
      {isLoading && <p>{t('channels.page-invitation.loading')}</p>}
    </div>
  )
}
