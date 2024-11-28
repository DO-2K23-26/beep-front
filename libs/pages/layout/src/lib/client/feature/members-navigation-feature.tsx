import { useGetMembersQuery } from '@beep/server'
import { RootState } from '@beep/store'
import { useModal } from '@beep/ui'
import { useFetchAllUsersConnectedQuery } from '@beep/user'
import { TransmitSingleton } from '@beep/utils'
import { skipToken } from '@reduxjs/toolkit/query'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import MembersNavigation from '../ui/members-navigation'

export function MembersNavigationFeature() {
  const { openModal } = useModal()

  const {
    data: usersConnected,
    refetch: refetchUsersConnected,
    isLoading: isLoadingConnected,
    isUninitialized: isUninitializedMembers,
  } = useFetchAllUsersConnectedQuery()

  const server = useSelector((state: RootState) => state.servers.server)
  const { data: members, isLoading: isLoadingUsers } = useGetMembersQuery(
    server?.id ?? skipToken
  )

  useEffect(() => {
    TransmitSingleton.subscribe('users/state', () => {
      if (!isUninitializedMembers) refetchUsersConnected()
    })
  }, [isUninitializedMembers, refetchUsersConnected])

  return (
    <MembersNavigation
      key={server?.id}
      isLoadingConnected={isLoadingConnected}
      isLoadingUsers={isLoadingUsers}
      usersConnected={usersConnected}
      members={members}
      openModal={openModal}
    />
  )
}
