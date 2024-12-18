import { ChannelEntity } from '@beep/contracts'
import { CurrentUserFeature } from '@beep/layout'
import { leftPaneState } from '@beep/responsive'
import { cn } from '@beep/utils'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { DisplayPrivateChannels } from './display-private-channels'
import { useTranslation } from 'react-i18next'
import { Separator } from '@beep/ui'

interface FriendsNavigationProps {
  channels?: ChannelEntity[]
  isLoadingChannel?: boolean
}

export function PrivateChannelsNavigation({
  channels,
  isLoadingChannel,
}: FriendsNavigationProps) {
  const leftDivState = useSelector(leftPaneState)
  const { t } = useTranslation()
  return (
    <div className="flex flex-row h-full bg-violet-200 rounded-r-3xl">
      <div
        className={cn('flex flex-row h-full', {
          'hidden lg:flex': !leftDivState,
        })}
      >
        <div className="flex flex-col items-center px-0 sm:px-1 bg-violet-300 h-full justify-between w-full">
          <div className="flex w-full flex-col items-start">
            <div className="flex flex-col w-full px-2 items-start">
              <p className="hidden sm:block sm:text-sm md:text-lg text-center py-2 text-slate-900 text-semibold ">
                {t('friends.private-channels-navigation.private_conversations')}
              </p>
              <Separator className="w-full bg-violet-400" />
            </div>
            <DisplayPrivateChannels
              channels={channels}
              isLoading={isLoadingChannel}
            />
          </div>
          <div className="pb-2 py-2 md:pb-4 md:px-4">
            <CurrentUserFeature />
          </div>
        </div>
      </div>
      <div className={cn('flex flex-grow')}>
        <Outlet />
      </div>
    </div>
  )
}
