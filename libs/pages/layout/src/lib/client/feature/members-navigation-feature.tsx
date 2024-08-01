import { useGetUsersByServerIdQuery } from '@beep/server'
import { RootState } from '@beep/store'
import { useModal } from '@beep/ui'
import { useFetchAllUsersConnectedQuery } from '@beep/user'
import { TransmitSingleton } from '@beep/utils'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import MembersNavigation from '../ui/members-navigation'
import { skipToken } from '@reduxjs/toolkit/query'

export function MembersNavigationFeature() {
  const { openModal } = useModal()

  const {
    data: usersConnected,
    refetch: refetchUsersConnected,
    isLoading: isLoadingConnected,
  } = useFetchAllUsersConnectedQuery()

  const server = useSelector((state: RootState) => state.servers.server)
  const { data: users, isLoading: isLoadingUsers } = useGetUsersByServerIdQuery(
    server?.id ?? skipToken
  )

  useEffect(() => {
    TransmitSingleton.subscribe('users/state', (message) => {
      refetchUsersConnected()
    })
  }, [refetchUsersConnected])

  return (
    <MembersNavigation
      isLoadingConnected={isLoadingConnected}
      isLoadingUsers={isLoadingUsers}
      usersConnected={usersConnected}
      users={users}
      openModal={openModal}
    />
  )
}
