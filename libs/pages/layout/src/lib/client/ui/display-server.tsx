import { ServerEntity } from '@beep/contracts'
import { ButtonShadCn } from '@beep/ui'

interface DisplayServerProps {
  server: ServerEntity
  icon?: string
  onServerChange?: () => void
}

export default function DisplayServer({
  server,
  icon,
  onServerChange,
}: DisplayServerProps) {
  return (
    <ButtonShadCn
      key={server.id}
      onClick={onServerChange}
      className="bg-violet-50"
      size={'responsiveSquare'}
      variant={'hoverRounded'}
    >
      {icon ? (
        <img
          src={icon}
          alt={server.name}
          className="aspect-square rounded-lg hover:rounded-xl  transition-all object-cover"
        />
      ) : (
        <p>{server.name.charAt(0).toUpperCase()}</p>
      )}
    </ButtonShadCn>
  )
}
