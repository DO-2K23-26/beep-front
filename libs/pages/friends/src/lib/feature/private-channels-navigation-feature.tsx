import { useGetPrivateChannelsQuery } from '@beep/friend'
import { PrivateChannelsNavigation } from '../ui/private-channels-navigation'

export function PrivateChannelsNavigationFeature() {
  const { data: privateChannels, isLoading: isLoadingChannel } =
    useGetPrivateChannelsQuery(undefined, {
      pollingInterval: 15 * 1000,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    })
  return (
    <PrivateChannelsNavigation
      channels={privateChannels}
      isLoadingChannel={isLoadingChannel}
    />
  )
}
