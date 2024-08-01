import {
  useJoinPublicServerMutation,
  useTransmitBannerQuery,
  useTransmitPictureQuery,
} from '@beep/server'
import ServerCard from '../ui/server-card'
import { useNavigate } from 'react-router'
import { skipToken } from '@reduxjs/toolkit/query'

interface ServerCardFeatureProps {
  id: string
  name: string
  description: string
}

export default function ServerCardFeature({
  id,
  name,
  description,
}: ServerCardFeatureProps) {
  const { data: icon } = useTransmitPictureQuery(id)
  const { currentData: banner } = useTransmitBannerQuery(id ?? skipToken)
  const [joinPublicServer] = useJoinPublicServerMutation()
  const navigate = useNavigate()

  return (
    <ServerCard
      name={name}
      description={description}
      icon={icon}
      banner={banner}
      joinServer={() => {
        joinPublicServer(id)
        navigate(`/servers/${id}`)
      }}
    />
  )
}
