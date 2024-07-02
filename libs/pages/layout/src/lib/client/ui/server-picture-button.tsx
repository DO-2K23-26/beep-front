import { ServerEntity } from '@beep/contracts'
import { Button, ButtonStyle } from '@beep/ui'

interface ServerPictureButton {
  server?: ServerEntity
  icon?: string
}

export function ServerPictureButton({ server, icon }: ServerPictureButton) {
  return (
    <Button
      style={ButtonStyle.SQUARE}
      onClick={() => {
        console.log('click')
      }}
    >
      {server ? (
        icon ? (
          <img
            src={icon}
            alt="Server"
            className=" aspect-square rounded-xl hover:rounded-2x3 transition-all object-cover"
          />
        ) : (
          <p className="max-w-[175px] truncate">{server.name[0]}</p>
        )
      ) : (
        <p>@ME</p>
      )}
    </Button>
  )
}
