import { createContext } from 'react'
import { PageServer } from '../ui/page-server'
import { MemberEntity, ServerEntity } from '@beep/contracts'
import { useParams } from 'react-router'
import { useGetMyMemberQuery, useGetMyServersQuery } from '@beep/server'

interface IServerContext {
  server?: ServerEntity
  myMember?: MemberEntity
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
  const { data: myMember } = useGetMyMemberQuery(
    { serverId: serverId ?? '' },
    { skip: serverId === undefined }
  )

  return (
    <ServerContext.Provider value={{ myMember, server }}>
      <PageServer />
    </ServerContext.Provider>
  )
}
