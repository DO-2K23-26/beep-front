import { useEffect, useRef } from 'react'
import Draggable from 'react-draggable'

interface MediaProps {
  stream: MediaStream | null
  username: string | null
  url: string | null
}

export function Media({ stream, url, username }: MediaProps) {
  const videoRef = useRef(null)

  return (
    <Draggable nodeRef={videoRef}>
      <div className="w-fit absolute" ref={videoRef}>
        <h4>{stream && stream.getVideoTracks().length > 0 && username}</h4>
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
      </div>
    </Draggable>
  )
}
