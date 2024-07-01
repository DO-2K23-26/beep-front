import { ChannelEntity } from '@beep/contracts'
import { useNavigate } from 'react-router'

export interface TaggedChannelFeatureProps {
  channel: ChannelEntity
  onClick: () => void
}

export const TaggedChannelFeature = ({
  channel,
  onClick,
}: TaggedChannelFeatureProps) => {
  const navigate = useNavigate()

  onClick = () => {
    navigate(`/servers/${channel.serverId}/channels/${channel.id}`)
  }

  return (
    <div
      className="fixed right-0 left-0 top-0 bottom-0 bg-[#101420]/50"
      onClick={() => onClick()}
    >
      <span className="flex items-center gap-3 p-3 bg-white rounded-lg">
        {channel.name}
      </span>
    </div>
  )
}
