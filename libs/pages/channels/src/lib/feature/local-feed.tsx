import { useSelector } from 'react-redux'
import {
    getAudioInputDevice,
    getBufferLength,
    getVideoDevice,
  } from '@beep/voice'
import { FC, memo, useEffect } from 'react'
import { useLocalMediaStream } from '../hooks/local-media-stream'
import { Media} from '../ui/media'  //available on branch 17-... when merging the changes
interface LocalFeedProps {
  sendData: (e: BlobEvent) => void
  channelId: string
  username: string
}

export const LocalFeed: FC<LocalFeedProps> = memo(
  ({ sendData, channelId, username }) => {
    const videoDevice = useSelector(getVideoDevice)
    const audioInputDevice = useSelector(getAudioInputDevice)
    const bufferLength = useSelector(getBufferLength)
    const { localMediaStream, recorder } = useLocalMediaStream({
      audio: audioInputDevice ? { deviceId: audioInputDevice.id } : true,
      video: videoDevice ? { deviceId: videoDevice.id } : true,
    })

    useEffect(() => {
      if (recorder && localMediaStream) {
        recorder.start(bufferLength)
        recorder.ondataavailable = sendData
      }
      return () => {
        if (recorder) {
          recorder.stop()
        }
      }
    }, [recorder, bufferLength, localMediaStream, sendData, channelId]) //stop local feed when changing channel id

    if (!localMediaStream) {
      return
    }

    return <Media url={null} username={username} stream={localMediaStream} />
  },
  (prevProps, nextProps) => prevProps.channelId === nextProps.channelId
)
