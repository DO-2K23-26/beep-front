import { ChannelEntity } from '@beep/contracts'
import { DisplayPinned } from '@beep/messages'
import { leftPaneState } from '@beep/responsive'
import { ButtonShadCn, Icon } from '@beep/ui'
import { useSelector } from 'react-redux'
import { ChannelNameDisplay } from './channel-name-display'

interface HeaderPageChannelProps {
  channel?: ChannelEntity
  isLoadingChannel: boolean
  displayChannelInfo: boolean
  toggleRightPane: () => void
  toggleLeftPane: () => void
}

export function HeaderPageChannel({
  channel,
  isLoadingChannel,
  displayChannelInfo,
  toggleLeftPane,
  toggleRightPane,
}: HeaderPageChannelProps) {
  const leftDivState = useSelector(leftPaneState)
  return (
    <div className="flex flex-row justify-between w-full gap-2">
      <div className="flex flex-row gap-2 lg:gap-6">
        {/* Button to hide the the left pane and icon to show channel name */}
        <ButtonShadCn
          size={'responsiveSquare'}
          variant={'hoverRounded'}
          className="lg:hidden !bg-violet-300"
          onClick={toggleLeftPane}
        >
          <Icon name="lucide:arrow-left" className="w-4 h-4" />
        </ButtonShadCn>
        {displayChannelInfo && (
          <ChannelNameDisplay
            key={'display_pinned_' + channel?.id}
            channelName={channel?.name}
            isLoadingChannel={channel === undefined || isLoadingChannel}
            hideName={leftDivState}
          />
        )}
      </div>
      {/* Button to display the list of pinned messages of a channel */}
      <div className="flex flex-row gap-2 lg:gap-6">
        {displayChannelInfo && (
          <DisplayPinned
            key={'display_pinned_' + channel?.id}
            channelId={channel?.id ?? ''}
            serverId={channel?.serverId ?? ''}
            isLoading={channel === undefined || isLoadingChannel}
          />
        )}

        <ButtonShadCn
          size={'responsiveSquare'}
          variant={'hoverRounded'}
          className="xl:hidden !bg-violet-300"
          onClick={toggleRightPane}
        >
          <Icon name="lucide:user" className="w-4 h-4" />
        </ButtonShadCn>
      </div>
    </div>
  )
}
