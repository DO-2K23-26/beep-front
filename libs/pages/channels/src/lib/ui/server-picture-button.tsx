import { ServerEntity } from '@beep/contracts'
import { useTransmitPictureQuery } from '@beep/server'
import { ButtonIcon } from '@beep/ui'
import { skipToken } from '@reduxjs/toolkit/query'

interface ServerPictureButton {
  server?: ServerEntity
}

export function ServerPictureButton({ server }: ServerPictureButton) {
  const { data: icon } = useTransmitPictureQuery(server?.id ?? skipToken, {
    skip: server?.icon === undefined || server?.icon === '',
  })
  return (
    <ButtonIcon
      buttonProps={{ size: 'responsiveSquare', variant: 'hoverRounded' }}
      className="bg-violet-300 size-fit"
      asChild
    >
      {server && icon ? (
        <img
          src={icon}
          alt="Server"
          className="aspect-square rounded-lg hover:rounded-xl transition-all object-cover size-full"
        />
      ) : (
        <p>{server && server.name[0]}</p>
      )}
    </ButtonIcon>
  )
}
