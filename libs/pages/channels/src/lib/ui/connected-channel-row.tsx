import { Badge, BadgeType } from "@beep/ui"
import LeaveVoiceChannelButton from "./leave-voice-channel-button"

interface ConnectedChannelRowProps {
  onLeave: () => void
  channelName: string
  serverName: string | undefined
  connectionState: string
}

export function ConnectedChannelRow({
  onLeave,
  channelName,
  serverName,
  connectionState,
}: ConnectedChannelRowProps) {
  return (
    <div className="w-full pb-3 flex flex-row items-center justify-between">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold text-slate-700 truncate max-w-24 sm:max-w-48">
          {channelName} / {serverName}
        </h3>
        {['closed', 'disconnected', 'failed'].includes(connectionState) && (
          <Badge
            type={BadgeType.DANGER}
            title={connectionState}
            className="!text-slate-900"
          />
        )}
        {['connecting', 'new'].includes(connectionState) && (
          <Badge
            type={BadgeType.WARNING}
            title={connectionState}
            className="!text-slate-900"
          />
        )}
        {['connected'].includes(connectionState) && (
          <Badge
            type={BadgeType.ONLINE}
            title={connectionState}
            className="!text-slate-900"
          />
        )}
      </div>
      <div className="flex flex-row gap-4">
        <LeaveVoiceChannelButton onClick={onLeave} />
      </div>
    </div>
  )
}

