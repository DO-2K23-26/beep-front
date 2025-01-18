import { createContext } from 'react'
import { PageServer } from '../ui/page-server'
import { Member, ServerEntity } from '@beep/contracts'
import { useParams } from 'react-router'
import { useGetMyMemberQuery, useGetMyServersQuery } from '@beep/server'

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
  const {  myMember } = useGetMyMemberQuery(
    { serverId: serverId ?? '' },
    {
      skip: serverId === undefined,
      selectFromResult: (query) => {
        if (!query.data) return { myMember: undefined, ...query }
        const member = new Member(query.data)
        return { myMember: member, ...query }
      },
    }
  )

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
