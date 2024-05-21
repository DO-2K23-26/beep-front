import LeaveChannelButton from './leave-voice-channel-button'

interface ConnectedChannelRowProps {
  onLeave: () => void
}

export function ConnectedChannelRow({ onLeave }: ConnectedChannelRowProps) {
  return (
    <div className="w-full pb-3 border-b-2 border-violet-400 flex flex-row items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-slate-700">
          Connected
        </h3>
      </div>
      <div className="flex flex-row gap-4">
        <LeaveChannelButton onClick={onLeave} />
      </div>
    </div>
  )
}
