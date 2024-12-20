import { leftPaneState } from '@beep/responsive'
import { cn } from '@beep/transmit'
import { useContext } from 'react'
import { useSelector } from 'react-redux'
import { PrivateChannelContext } from '../feature/page-private-channel-feature'
import { FriendRow, ProfilePictureSize } from './friend-row'
import { ToggleLeftPaneButton } from './toggle-left-pane-button'
import { DisplayPinned } from '@beep/messages'
import { useParams } from 'react-router'

export function HeaderPrivateChannel() {
  const { channelId } = useParams<{ channelId: string }>()
  const leftDivState = useSelector(leftPaneState)
  const { user } = useContext(PrivateChannelContext)

  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center w-fit">
        <div>
          <ToggleLeftPaneButton />
        </div>
        <FriendRow
          user={user}
          className={cn(
            'hover:bg-transparent max-w-40 sm:max-w-60 md:max-w-80 lg:max-w-none',
            {
              'max-w-24 sm:max-w-40': leftDivState,
            }
          )}
          profilePictureSize={ProfilePictureSize.Large}
        />
      </div>
      <DisplayPinned channelId={channelId ?? ''} />
    </div>
  )
}
