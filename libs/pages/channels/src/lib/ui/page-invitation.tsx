import { useEffect } from 'react'
import { useJoinPrivateServerMutation } from '@beep/server'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

export function PageInvitation() {
  const { inviteId } = useParams<{ inviteId: string }>()
  const navigate = useNavigate()
  const [joinPrivateServer, { isLoading, isError, isSuccess, data }] =
    useJoinPrivateServerMutation()

  useEffect(() => {
    joinPrivateServer(inviteId!)
  }, [])

  useEffect(() => {
    if (isError) {
      toast.error('Error joining the server. Please try again.')
    }
    if (isSuccess && data) {
      navigate(`/servers/${data.serverId}`)
      toast.success('Successfully joined the server!')
    }
  }, [isError, isSuccess, data, navigate])

  return (
    <div className="bg-violet-200 w-full p-4">
      {isLoading && <p>Loading...</p>}
    </div>
  )
}
