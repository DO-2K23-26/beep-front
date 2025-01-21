import { cn } from '@beep/utils'
import { useRef } from 'react'
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
      <div
        className={cn('w-fit absolute bg-violet-800 rounded-lg z-[1000] ', {
          'hidden': stream.getVideoTracks().length == 0,
        })}
        ref={videoRef}
      >
        <h4
          className={
            'pl-1 text-base text-violet-50'
          }
        >
          {stream && stream.getVideoTracks().length > 0 && username}
        </h4>
        {stream && (
          <video
            className="rounded-b-lg"
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
