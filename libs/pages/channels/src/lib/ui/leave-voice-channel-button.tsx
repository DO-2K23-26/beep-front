import { Icon } from '@beep/ui'

interface LeaveVoiceChannelButtonProps {
  onClick: () => void
}

export default function LeaveVoiceChannelButton({
  onClick,
}: LeaveVoiceChannelButtonProps) {
  return (
    <button
      className="flex justify-center items-center text-slate-900 rounded-md hover:rounded-2xl transition-all hover:bg-violet-400 p-2"
      onClick={onClick}
    >
      <Icon name="lucide:phone-outgoing" className="w-5 h-5 text-slate-900" />
    </button>
  )
}
