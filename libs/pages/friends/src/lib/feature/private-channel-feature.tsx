import { ChannelEntity } from '@beep/contracts'
import { ButtonShadCn } from '@beep/ui'
import { FriendRow } from '../ui/friend-row'
import { useNavigate, useParams } from 'react-router'
import { cn } from '@beep/utils'

interface PrivateChannelFeature {
  channel: ChannelEntity
}

export function PrivateChannelFeature({ channel }: PrivateChannelFeature) {
  const navigate = useNavigate()
  const { channelId } = useParams<{ channelId: string }>()
  const toPrivateChannel = () => {
    navigate(`/friends/${channel.id}`)
  }
  return (
    <ButtonShadCn
      variant={'ghost'}
      className={'w-full px-2'}
      onClick={toPrivateChannel}
    >
      <FriendRow
        user={channel.users[0]}
        className={cn(' hover:bg-violet-500/60 transition-all', {
          'bg-violet-500/30': channelId === channel.id,
        })}
      />
    </ButtonShadCn>
  )
}
