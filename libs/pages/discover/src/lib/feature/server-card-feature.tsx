import {
  useJoinPublicServerMutation,
  useTransmitBannerQuery,
  useTransmitPictureQuery,
} from '@beep/server'
import { useNavigate } from 'react-router'
import ServerCard from '../ui/server-card'

interface ServerCardFeatureProps {
  id: string
  name: string
  description: string
  hasBanner: boolean
  hasIcon: boolean
}

export default function ServerCardFeature({
  id,
  name,
  description,
  hasBanner,
  hasIcon,
}: ServerCardFeatureProps) {
  const { data: icon } = useTransmitPictureQuery(id, { skip: !hasIcon })
  const { currentData: banner } = useTransmitBannerQuery(id, {
    skip: !hasBanner,
  })
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
