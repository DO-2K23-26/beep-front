import { ChannelEntity } from '@beep/contracts'
import { Button, ButtonStyle, Icon } from '@beep/ui'
import { ChannelNameDisplay } from './channel-name-display'
import DisplayPinned from './display-pinned'

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
  return (
    <div className="flex flex-row justify-between w-full gap-2">
      <div className="flex flex-row gap-2 lg:gap-6">
        {/* Button to hide the the left pane and icon to show channel name */}
        <Button
          style={ButtonStyle.SQUARE}
          className="lg:hidden !bg-violet-300"
          onClick={toggleLeftPane}
        >
          <Icon name="lucide:arrow-left" className="w-4 h-4" />
        </Button>
        {displayChannelInfo && (
          <ChannelNameDisplay
            key={'display_pinned_' + channel?.id}
            channelName={channel?.name}
            isLoadingChannel={channel === undefined || isLoadingChannel}
          />
        )}
      </div>
      {/* Button to display the list of pinned messages of a channel */}
      <div className="flex flex-row gap-2 lg:gap-6">
        {displayChannelInfo && (
          <DisplayPinned
            key={'display_pinned_' + channel?.id}
            channelId={channel?.id ?? ''}
            isLoading={channel === undefined || isLoadingChannel}
          />
        )}

        <Button
          style={ButtonStyle.SQUARE}
          className="xl:hidden !bg-violet-300"
          onClick={toggleRightPane}
        >
          <Icon name="lucide:user" className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
