import { useEffect } from 'react'
import { useJoinPrivateServerMutation } from '@beep/server'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

export function PageInvitation() {
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
      toast.error('Error joining the server. Please try again.')
    }
    if (isSuccess && data) {
      toast.success('Successfully joined the server!')
      navigate(`/servers/${data.serverId}`)
    }
  }, [isError, isSuccess, data, error, navigate])

  return (
    <div className="bg-violet-200 w-full p-4">
      {isLoading && <p>Loading...</p>}
    </div>
  )
}
