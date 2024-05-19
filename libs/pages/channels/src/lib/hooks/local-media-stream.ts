import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getVoiceState } from '@beep/voice'

interface LocalMediaStream {
  localMediaStream: MediaStream | null
  recorder: MediaRecorder | null
}

export function useLocalMediaStream(
  constraints: MediaStreamConstraints
): LocalMediaStream {
  const [localMediaStream, setLocalMediaStream] = useState<MediaStream | null>(
    null
  )
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null)
  const voiceConfig = useSelector(getVoiceState)

  useEffect(() => {
    if (!recorder && !localMediaStream) {
      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        setLocalMediaStream(stream)
        setRecorder(
          new MediaRecorder(stream, {
            videoBitsPerSecond: voiceConfig.videoBitsPerSecond,
            audioBitsPerSecond: voiceConfig.audioBitsPerSecond,
            mimeType: voiceConfig.codec,
          })
        )
      })
    }

    return () => {
      localMediaStream?.getTracks().forEach((track) => {
        track.stop()
      })
    }
  }, [
    recorder,
    localMediaStream,
    constraints,
    voiceConfig.audioBitsPerSecond,
    voiceConfig.codec,
    voiceConfig.videoBitsPerSecond,
  ])

  return {
    localMediaStream,
    recorder,
  }
}
