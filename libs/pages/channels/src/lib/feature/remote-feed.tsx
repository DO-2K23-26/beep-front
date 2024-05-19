import { UserConnectedEntity, UserEntity } from '@beep/contracts'
import { getVoiceState } from '@beep/voice'
import { FC, memo, useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import { Media } from '../ui/media'
import { socket } from '@beep/utils'
interface RemoteFeedProps {
  member: UserConnectedEntity
}

export const RemoteFeed: FC<RemoteFeedProps> = memo(
  ({ member }) => {
    const mediaSource = useRef<MediaSource>(new MediaSource())
    const sourceBuffer = useRef<SourceBuffer | null>(null)
    const codec = useSelector(getVoiceState).codec
    const [url, setUrl] = useState<string | null>(null)

    const handleSourceOpen = useCallback(() => {
      sourceBuffer.current = mediaSource.current.addSourceBuffer(codec)
    }, [codec])

    useEffect(() => {
      const media = mediaSource.current

      const handleOnAudioAnswer = (payload: { audio: ArrayBuffer }) => {
        console.log(payload)
        if (sourceBuffer.current) {
          sourceBuffer.current.appendBuffer(payload.audio)
        }
      }

      if (!media) {
        return
      }

      if (!MediaSource.isTypeSupported(codec)) {
        console.error('Unsupported codec')
        return
      }

      media.addEventListener('sourceopen', handleSourceOpen)

      setUrl((prevUrl) => URL.createObjectURL(media))

      socket.on('audio', handleOnAudioAnswer)

      return () => {
        media.removeEventListener('sourceopen', handleSourceOpen)
        socket.off('audio', handleOnAudioAnswer)
        if (url) {
          URL.revokeObjectURL(url)
        }
      }
    }, [handleSourceOpen, codec])

    if (!url) {
      return null
    }

    return <Media stream={null} url={url} username={member.username} />
  },
  (prevProps, nextProps) => prevProps.member.id === nextProps.member.id
)
