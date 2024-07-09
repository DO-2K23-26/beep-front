import { ServerEntity } from '@beep/contracts'
import { useTransmitPictureQuery } from '@beep/server'
import { Button, ButtonStyle } from '@beep/ui'
import { skipToken } from '@reduxjs/toolkit/query'

interface DisplayServerProps {
  server: ServerEntity
  onServerChange?: () => void
}

export default function DisplayServer({
  server,
  onServerChange,
}: DisplayServerProps) {
  const {data: icon} = useTransmitPictureQuery(server?.id ?? skipToken)

  return (
    <Button
      key={server.id}
      onClick={onServerChange}
      style={ButtonStyle.SQUARE}
      className="!bg-violet-50"
    >
      {icon ? (
        <img
          src={icon}
          alt={server.name}
          className="aspect-square rounded-xl hover:rounded-2xl transition-all object-cover"
        />
      ) : (
        <p>{server.name}</p>
      )}
    </Button>
  )
}
