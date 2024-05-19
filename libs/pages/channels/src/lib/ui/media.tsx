import { useEffect, useRef } from 'react'
import Draggable from 'react-draggable'

interface MediaProps {
  stream: MediaStream | null
  username: string | null
  url: string | null
}

export function Media({ stream, url, username }: MediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current && url) {
      videoRef.current.src = url
      videoRef.current.play()
    }
  }, [videoRef, url])

  return (
    <Draggable>
      <div className="w-[70%] absolute">
        <h4>{username}</h4>
        {stream && (
          <video
            className="rounded-lg"
            ref={(ref) => {
              if (ref) {
                ref.srcObject = stream
              }
            }}
            autoPlay
          />
        )}
        {url && <video className="rounded-lg" ref={videoRef} />}
      </div>
    </Draggable>
  )
}
