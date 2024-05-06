import { UserConnectedEntity } from '@beep/contracts'
import { Badge, BadgeType, Button, ButtonStyle, Icon } from '@beep/ui'

interface DisplayMemberProps {
  user: UserConnectedEntity
  isConnected: boolean
  onPrivateMessage?: () => void
}

export default function DisplayMember({
  user,
  isConnected,
  onPrivateMessage,
}: DisplayMemberProps) {
  return (
    <div className="flex flex-row justify-between items-center p-2 hover:bg-violet-400 rounded-xl transition-all cursor-pointer w-full group gap-2">
      <div className="flex flex-row gap-3 items-center">
        <img
          className="w-9 min-w-[36px] h-9 min-h-[36px] bg-violet-50 rounded-xl"
          src='/picture.svg'
          alt={user.username + '-img'}
        />
        <h5 className="font-semibold text-xs truncate max-w-[125px]">
          {user.username}
        </h5>
      </div>
      <div className="flex-row gap-3 items-center flex">
        <Button
          style={ButtonStyle.NONE}
          className="hidden sm:flex invisible group-hover:visible"
          onClick={onPrivateMessage}
        >
          <Icon name="lucide:message-circle-more" />
        </Button>
        {
          isConnected ? (
            <Badge
              type={BadgeType.ONLINE}
              title="Online"
              className="!text-slate-900"
            />
          ) : (
            <Badge
              type={BadgeType.OFFLINE}
              title="Offline"
              className="!text-slate-900"
            />
          )
        }
      </div>
    </div>
  )
}
