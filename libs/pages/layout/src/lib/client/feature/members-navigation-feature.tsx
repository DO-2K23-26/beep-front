import { useModal } from '@beep/ui'
import MembersNavigation from '../ui/members-navigation'
import { useFetchAllUsersConnectedQuery, useFetchAllUsersQuery } from '@beep/user'
import { useEffect } from 'react'
import { TransmitSingleton } from '@beep/utils'

export default function MembersNavigationFeature() {
  const { openModal, closeModal } = useModal()

  const { data: usersConnected, refetch: refetchUsersConnected } = useFetchAllUsersConnectedQuery()
  const { data: users, refetch: refetchUsers } = useFetchAllUsersQuery()

  useEffect(() => {
    TransmitSingleton.subscribe('users/state', (message) => { refetchUsersConnected() })
  }, [])


  return (
    usersConnected === undefined || users === undefined ? (
      <></>
    ) : (
      <MembersNavigation
        usersConnected={usersConnected}
        users={users}
        openModal={openModal}
        closeModal={closeModal}
      />
    )
  )
}
