import { ChannelEntity, ChannelType } from '@beep/contracts'
import {
  Button,
  ButtonStyle,
  Icon,
  ModalConfirmation,
  useModal,
} from '@beep/ui'

interface DisplayChannelProps {
  channel: ChannelEntity
  onJoinChannel?: (serverId: string, channelId: string) => void
  onDeleteChannel?: () => void
}

export default function DisplayChannel({
  channel,
  onJoinChannel,
  onDeleteChannel,
}: DisplayChannelProps) {
  const { openModal, closeModal } = useModal()
  return (
    <div className="flex flex-col group w-full" onClick={() => onJoinChannel ? onJoinChannel(channel.serverId, channel.id) : {}}>
      <div className="flex flex-row justify-between items-center w-full px-3 py-2 hover:bg-violet-400 cursor-pointer rounded-xl">
        <div className="flex flex-row justify-center items-center gap-2">
          {channel.type === ChannelType.VOICE ? (
            <Icon name="lucide:volume-2" className="w-4 h-4" />
          ) : (
            <Icon name="lucide:hash" className="w-4 h-4" />
          )}
          <p className="font-semibold max-w-[150px] truncate">{channel.name}</p>
        </div>
        <div className="flex justify-center items-center invisible group-hover:visible">
          <Button
            className="!hidden"
            style={ButtonStyle.NONE}
            onClick={(event?: MouseEvent) => {
              event?.stopPropagation()
              openModal({
                content: (
                  <ModalConfirmation
                    title="Delete channel"
                    description="Please confirm your action."
                    isDelete={true}
                    callback={() => {
                      onDeleteChannel && onDeleteChannel()
                      closeModal()
                    }}
                  />
                ),
              })
            }}
          >
            <Icon name="lucide:settings" className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
