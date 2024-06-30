import { ServerEntity } from '@beep/contracts'
import { useTransmitPictureQuery } from '@beep/server'
import { Button, ButtonStyle } from '@beep/ui'

interface DisplayServerProps {
  server: ServerEntity
  onServerChange?: () => void
}

export default function DisplayServer({
  server,
  onServerChange,
}: DisplayServerProps) {
  const icon = useTransmitPictureQuery(server?.id || '').currentData || ''

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
