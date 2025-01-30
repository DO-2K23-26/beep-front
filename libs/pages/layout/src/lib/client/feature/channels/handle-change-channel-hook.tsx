import { ServerEntity } from "@beep/contracts"
import { useGetCurrentStreamingUsersQuery } from "@beep/server"
import { TransmitSingleton } from "@beep/transmit"
import { skipToken } from "@reduxjs/toolkit/query"
import { useEffect } from "react"

export function useHandleChangeChannel({
  server
}: {server: ServerEntity | undefined}) {
  const { refetch } = useGetCurrentStreamingUsersQuery(server?.id ?? skipToken)
  useEffect(() => {
    if (!server?.id) return
    TransmitSingleton.subscribe(`servers/${server.id}/movement`, () => {
      refetch()
    })
  }, [refetch, server])
}
