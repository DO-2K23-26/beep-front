import { useSelector } from 'react-redux'
import { getVoiceState } from '@beep/voice'
import { FC, memo } from 'react'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Media } from '../ui/media';

interface LocalFeedProps {
  sendData: (e: BlobEvent) => void
  channelId: string
  username: string
}

export const LocalFeed: FC<LocalFeedProps> = memo(
  ({ username }) => {
    const { localStream } = useSelector(getVoiceState)


    if (!localStream) {
      return
    }

    return <Media url={null} username={username} stream={localStream} />
  },
  (prevProps, nextProps) => prevProps.channelId === nextProps.channelId
)
