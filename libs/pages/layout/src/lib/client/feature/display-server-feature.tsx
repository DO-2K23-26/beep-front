import { ServerEntity } from '@beep/contracts'
import {
  useTransmitPictureQuery
} from '@beep/server'
import { skipToken } from '@reduxjs/toolkit/query'
import { useNavigate, useParams } from 'react-router-dom'
import DisplayServer from '../ui/display-server'

interface DisplayServerFeatureProps {
  server: ServerEntity
}

export default function DisplayServerFeature({
  server,
}: DisplayServerFeatureProps) {
  const navigate = useNavigate()
  const { data: icon } = useTransmitPictureQuery(server?.id ?? skipToken, {
    skip: server?.icon === '',
  })

  const { serverId } = useParams<{ serverId: string }>()
  const onServerChange = () => {
    if (serverId !== server.id) {
      navigate(`/servers/${server.id}`)
    }
  }
  return (
    <DisplayServer
      server={server}
      onServerChange={onServerChange}
      icon={icon}
    />
  )
}
