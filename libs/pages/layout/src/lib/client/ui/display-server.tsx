import { ServerEntity } from '@beep/contracts'
import { Button, ButtonStyle } from '@beep/ui'

interface DisplayServerProps {
  server: ServerEntity
  onServerChange?: () => void
}

export default function DisplayServer({
  server,
  onServerChange,
}: DisplayServerProps) {
  return (
    <Button
      key={server.id}
      onClick={onServerChange}
      style={ButtonStyle.SQUARE}
      className="!bg-violet-50"
    >
      {
        server.picture ? (
          <img
            src={server.picture}
            alt={server.name}
            className="rounded-xl hover:rounded-2xl transition-all"
          />
        ) : (
          <p>{server.name}</p>
        )
      }
      
    </Button>
  )
}
