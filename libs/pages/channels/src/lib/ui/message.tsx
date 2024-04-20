import { UserEntity } from '@beep/contracts'
import { Icon } from '@beep/ui'

interface MessageProps {
  message: string
  user?: UserEntity
  image?: string
  gif?: string
  video?: string
  onEdit?: () => void
  onDelete?: () => void
  createdAt?: string
  updatedAt?: string
}

export default function Message({
  user,
  message,
  onDelete,
  onEdit,
  createdAt,
  updatedAt,
}: MessageProps) {
  return (
    <div className="flex flex-col gap-2 hover:bg-violet-300 p-3 rounded-xl group">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-4 items-center">
          <div className="flex flex-row gap-3 items-center overflow-hidden">
            <img
              className="w-9 min-w-[36px] h-9 min-h-[36px] bg-violet-50 rounded-xl"
              src={(user && user.profilePicture) || '/picture.svg'}
              alt={user && user.username + '-img'}
            />
            <h5 className="font-semibold text-xs truncate">
              {(user && user.username) || 'Casper'}
            </h5>
          </div>
          <p className="font-normal text-xs truncate">{createdAt}</p>
        </div>
        <div className="flex flex-row gap-4 items-center invisible group-hover:visible pr-2">
          <button onClick={onEdit}>
            <Icon name="lucide:pencil" className="w-4 h-4" />
          </button>
          <button onClick={onDelete}>
            <Icon name="lucide:trash" className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex flex-row gap-2 ">
        <p className="text-xs font-semibold break-all bg-violet-50 rounded-xl rounded-tl-none p-6 flex ">
          {message}
        </p>
      </div>
    </div>
  )
}
