import { cn } from '@beep/utils';
import { useFetchProfilePictureQuery } from '@beep/user'
import { Icon } from '@beep/ui';
interface MediaProps {
  stream: MediaStream | null
  username: string | null
  url: string | null
  userId: string | undefined
  expand: (arg0: string) => void
  fullScreen: boolean
}

export function Media({ stream, url, username, userId, expand, fullScreen}: MediaProps) {
  const { currentData: userProfilePicture } = useFetchProfilePictureQuery(
    userId ?? ''
  )

  const onExpand = () => {
    expand(userId ?? '')
  }

  return (
    <div
      className={cn('w-fit bg-violet-800 rounded-lg z-[1000] group')}
    >
      <div className="flex flex-col relative">
        {/* Header overlay - visible on hover */}
        <div
          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg" />

        {/* Username and expand icon container */}
        <div
          className="absolute top-0 left-0 right-0 flex justify-between items-start p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex items-center gap-2">
            <img
              className="w-8 h-8 rounded-full bg-violet-50"
              src={userProfilePicture ?? '/picture.svg'}
              alt={`${username}'s profile`}
            />
            <div className="text-white font-semibold">{username}</div>
          </div>
          <button
            className="text-white hover:text-violet-200 transition-colors"
            onClick={onExpand}
          >
            <Icon
              name={fullScreen ? 'lucide:shrink' : 'lucide:expand'}
              className="w-6 h-6"
            />
          </button>
        </div>

        {/* Video or Placeholder */}
        {stream && stream.getVideoTracks().length > 0 ? (
          <div className="flex">
            <video
              className="rounded-lg w-full"
              ref={(ref) => {
                if (ref) {
                  ref.srcObject = stream;
                }
              }}
              autoPlay
            />
          </div>
        ) : (
          <div
            className="flex">
            <video
              className="rounded-lg w-full"
              ref={(ref) => {
                if (ref) {
                  ref.srcObject = stream;
                }
              }}
              autoPlay
            />
            <img
              className="w-16 h-16 rounded-full bg-violet-50"
              src={userProfilePicture ?? '/picture.svg'}
              alt={`${username}'s profile`}
            />
          </div>
        )}
      </div>
    </div>
  )
}
