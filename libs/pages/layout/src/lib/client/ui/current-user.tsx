import { UserEntity } from '@beep/contracts'
import { Badge, BadgeType, Button, ButtonStyle, Icon } from '@beep/ui'

interface CurrentUserProps {
  user: UserEntity
  onMicrophone?: () => void
  onPhone?: () => void
  onSettings?: () => void
}

export default function CurrentUser({
  user,
  onMicrophone,
  onPhone,
  onSettings,
}: CurrentUserProps) {
  return (
    <>
      {/* TODO: implement user in channel ui}
      {/* {focusedVoiceChannel && (
        <div className="w-full pb-3 border-b-2 border-violet-400 flex flex-row items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-700">
              {focusedVoiceChannel.name}
            </h3>
            <ConnectionStatus isConnected={true} />
          </div>
          <div className="flex flex-row gap-4">
            <CutCameraButton />
            <LeaveChannelButton
              onClick={() => {
                channelService.disconnect({
                  isConnection: false,
                  user: user.username,
                  channel: focusedVoiceChannel.name,
                })
                dispatch({ type: 'server/leaveVoiceChannel' })
              }}
            />
          </div>
        </div>
      )} */}
      <div className="flex flex-row justify-between items-center gap-4">
        <div className="flex flex-row gap-3">
          <img
            className="w-[50px] min-w-[50px] h-[50px] min-h-[50px] bg-violet-50 flex justify-center items-center rounded-2xl"
            src={user.profilePicture || 'current user picture'}
            alt="Profilepicture"
          />
          <div className="flex flex-col justify-between">
            <h5 className="font-bold max-w-[100px] truncate">
              {user.username}
            </h5>
            <Badge
              type={BadgeType.ONLINE}
              title="Online"
              className="!text-slate-900"
            />
          </div>
        </div>

        <div className="flex-row flex gap-4 ">
          <Button
            style={ButtonStyle.NONE}
            onClick={onMicrophone}
            className="cursor-pointer"
          >
            <Icon name="lucide:mic" className="!w-5 !h-5" />
          </Button>
          <Button
            style={ButtonStyle.NONE}
            onClick={onPhone}
            className="cursor-pointer"
          >
            <Icon name="lucide:phone" className="!w-5 !h-5" />
          </Button>
          {/* Make the settings modal */}
          <Button
            style={ButtonStyle.NONE}
            onClick={onSettings}
            className="cursor-pointer"
          >
            <Icon name="lucide:settings" className="!w-5 !h-5" />
          </Button>
        </div>
      </div>
    </>
  )
}
