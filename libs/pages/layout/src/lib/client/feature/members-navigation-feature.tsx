import { useGetUsersByServerIdQuery } from '@beep/server'
import { RootState } from '@beep/store'
import { useModal } from '@beep/ui'
import { useFetchAllUsersConnectedQuery } from '@beep/user'
import { TransmitSingleton } from '@beep/utils'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import MembersNavigation from '../ui/members-navigation'

export function MembersNavigationFeature() {
  const { openModal, closeModal } = useModal()

  const {
    data: usersConnected,
    refetch: refetchUsersConnected,
    isLoading: isLoadingConnected,
  } = useFetchAllUsersConnectedQuery()

  const server = useSelector((state: RootState) => state.servers.server)
  const { data: users, isLoading: isLoadingUsers } = useGetUsersByServerIdQuery(
    server?.id ?? ''
  )

  useEffect(() => {
    TransmitSingleton.subscribe('users/state', (message) => {
      refetchUsersConnected()
    })
  }, [refetchUsersConnected])

  return (
    <MembersNavigation
      usersConnected={usersConnected}
      users={users}
      openModal={openModal}
    />
  )
}
