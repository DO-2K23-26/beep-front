import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Icon } from '@beep/ui'
import { getVoiceState } from '@beep/voice'
import { useGetMeQuery } from '@beep/user' // Adjust the import path as needed

const MAX_VIDEOS_PER_PAGE = 12

export function VoiceChat() {
  const { sortedMembers, localStream } = useSelector(getVoiceState)
  const { data: me } = useGetMeQuery()

  const videos = [
    ...Array.from({ length: 13 }, (_, i) => ({
      id: `user${i + 1}`,
      stream: localStream,
      username: `User ${i + 1}`,
    })),
  ]

  const [page, setPage] = useState(0)
  const [expandedStream, setExpandedStream] = useState<{
    id: string
    stream: MediaStream
    username: string
  } | null>(null)

  const filteredVideos = expandedStream
    ? videos.filter((video) => video.id !== expandedStream.id)
    : videos

  const paginatedStreams = filteredVideos.slice(
    page * MAX_VIDEOS_PER_PAGE,
    (page + 1) * MAX_VIDEOS_PER_PAGE
  )

  const totalPages = Math.ceil(filteredVideos.length / MAX_VIDEOS_PER_PAGE)
  const videoCount = paginatedStreams.length
  const gridSize =
    videoCount <= 2
      ? 'minmax(300px, 1fr)'
      : videoCount <= 4
      ? 'minmax(200px, 1fr)'
      : 'minmax(150px, 1fr)'

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {expandedStream ? (
        <>
          <div className="w-full h-2/3 relative border rounded-xl overflow-hidden mb-4 group">
            <video
              ref={(video) =>
                video && (video.srcObject = expandedStream?.stream)
              }
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 text-xs rounded">
              {expandedStream.username}
            </div>
            <button
              onClick={() => setExpandedStream(null)}
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Icon name="lucide:shrink" className="h-6 w-6" />
            </button>
          </div>
          <div className="flex gap-2 w-full h-1/3 p-4 overflow-x-auto">
            {paginatedStreams.map(({ username, id, stream }) => (
              <div
                key={id}
                className="relative w-1/6 min-w-[150px] h-full border rounded-xl overflow-hidden group"
              >
                <video
                  ref={(video) => video && (video.srcObject = stream)}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 text-xs rounded">
                  {username}
                </div>
                <button
                  onClick={() =>
                    setExpandedStream({ id, username, localStream })
                  }
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Icon name="lucide:expand" className="h-6 w-6" />
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-4 gap-2 h-fit">
          {paginatedStreams.map(({ username, id, stream }) => (
            <div
              key={id}
              className="relative border rounded-xl overflow-hidden group"
            >
              <video
                ref={(video) => video && (video.srcObject = stream)}
                autoPlay
                playsInline
                className="object-contain  bg-violet-500/50 w-full h-full"
              />
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 text-xs rounded">
                {username}
              </div>
              <button
                onClick={() => setExpandedStream({ id, username, stream })}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Icon name="lucide:expand" className="h-6 w-6" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-4 flex space-x-2">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
