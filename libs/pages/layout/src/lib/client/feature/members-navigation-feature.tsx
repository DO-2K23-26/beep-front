import { useGetMembersQuery, useGetMyServersQuery } from '@beep/server'
import { useModal } from '@beep/ui'
import { useFetchAllUsersConnectedQuery } from '@beep/user'
import { TransmitSingleton } from '@beep/utils'
import { skipToken } from '@reduxjs/toolkit/query'
import { useEffect } from 'react'
import MembersNavigation from '../ui/members-navigation'
import { useParams } from 'react-router'

export function MembersNavigationFeature() {
  const { openModal } = useModal()
  const { serverId } = useParams<{ serverId: string }>()

  const { server } = useGetMyServersQuery(undefined, {
    skip: serverId === undefined,
    selectFromResult(state) {
      if (state.data === undefined) return { server: undefined, ...state }
      return {
        server: state.data.find((server) => server.id === serverId),
        ...state,
      }
    },
  })
  const {
    data: usersConnected,
    refetch: refetchUsersConnected,
    isLoading: isLoadingConnected,
    isUninitialized: isUninitializedMembers,
  } = useFetchAllUsersConnectedQuery()

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
