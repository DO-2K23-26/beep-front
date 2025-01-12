import { ServerEntity } from "@beep/contracts"
import { useGetCurrentStreamingUsersQuery } from "@beep/server"
import { TransmitSingleton } from "@beep/transmit"
import { useEffect } from "react"

export function useHandleChangeChannel({
  server
}: {server: ServerEntity}) {
  const { refetch } = useGetCurrentStreamingUsersQuery(server.id ?? '')
  useEffect(() => {
    if (!server?.id) return
    TransmitSingleton.subscribe(`servers/${server.id}/movement`, () => {
      refetch()
    })
  }, [refetch, server])
}
