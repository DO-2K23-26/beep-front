import { useModal } from '@beep/ui'
import MembersNavigation from '../ui/members-navigation'
import {
  useFetchAllUsersConnectedQuery,
  useFetchAllUsersQuery,
} from '@beep/user'
import { useEffect } from 'react'
import { TransmitSingleton } from '@beep/utils'

export function MembersNavigationFeature() {
  const { openModal, closeModal } = useModal()

  const { data: usersConnected, refetch: refetchUsersConnected } =
    useFetchAllUsersConnectedQuery()
  const { data: users } = useFetchAllUsersQuery()

  useEffect(() => {
    TransmitSingleton.subscribe('users/state', (message) => {
      refetchUsersConnected()
    })
  }, [refetchUsersConnected])

  return usersConnected === undefined || users === undefined ? null : (
    <MembersNavigation
      usersConnected={usersConnected}
      users={users}
      openModal={openModal}
      closeModal={closeModal}
    />
  )
}
