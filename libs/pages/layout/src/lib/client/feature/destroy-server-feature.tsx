import { getServersState, useDeleteServerMutation } from '@beep/server'
import { useState } from 'react'
import { useSelector } from 'react-redux'

//TODO : finish this tomorrow
export default function DestroyServerFeature() {
  const [confirmation, setConfirmation] = useState('')
  const CONFIRMATION_TEXT = 'DESTROY'
  const focusedServer = useSelector(getServersState).server?.id
  const [deleteServer, result] = useDeleteServerMutation()
  const [error, setError] = useState<string | null>(null)

  const onSubmit = () => {
    if (!focusedServer) {
      setError('No server selected')
      return
    }
    if (confirmation !== CONFIRMATION_TEXT) {
      setError('Confirmation text does not match')
      return
    }
    deleteServer(focusedServer)
  }

  return (
    <div>
      <h1>Welcome to DestroyServerFeature!</h1>
    </div>
  )
}
