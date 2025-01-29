import { Member, ServerEntity } from '@beep/contracts'
import {
  useGetMyMemberQuery,
  useGetMyServersQuery,
  useGetRolesQuery,
} from '@beep/server'
import { skipToken } from '@reduxjs/toolkit/query'
import { createContext, useMemo } from 'react'
import { useParams } from 'react-router'
import { PageServer } from '../ui/page-server'

interface IServerContext {
  server?: ServerEntity
  myMember?: Member
}

export const ServerContext = createContext<IServerContext>({})

export function PageServerFeature() {
  const { serverId } = useParams<{ serverId: string }>()
  const { server } = useGetMyServersQuery(undefined, {
    selectFromResult: (query) => {
      const server = query.data?.find((server) => server.id === serverId)
      return { server, ...query }
    },
  })
  const { data: memberData } = useGetMyMemberQuery(
    { serverId: serverId ?? '' },
    {
      skip: serverId === undefined,
    }
  )

  const { defaultRole } = useGetRolesQuery(serverId ?? skipToken, {
    selectFromResult: (query) => {
      if (!query.data) return { defaultRole: undefined, ...query }
      const defaultRole = query.data.find((role) => role.id === serverId)
      return { defaultRole, ...query }
    },
  })
  const myMember = useMemo(() => {
    if (!memberData) return undefined
    return new Member(
      memberData,
      server?.ownerId === memberData.userId,
      defaultRole
    )
  }, [defaultRole, memberData, server?.ownerId])

  return (
    <ServerContext.Provider
      value={{
        myMember,
        server,
      }}
    >
      <PageServer />
    </ServerContext.Provider>
  )
}
