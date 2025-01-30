// eslint-disable-next-line @nx/enforce-module-boundaries
import { ChannelEntity, GetChannelsResponse } from '@beep/contracts'

export function sortChannels(
  channels: GetChannelsResponse | null | undefined
): ChannelEntity[] {
  const textChannels: ChannelEntity[] =
    channels?.textChannels.map((i) => i) ?? []
  const voiceChannels: ChannelEntity[] =
    channels?.voiceChannels.map((i) => i) ?? []

  let allChannels = [...textChannels, ...voiceChannels]

  if (allChannels.length > 0) {
    allChannels = allChannels.sort((a, b) => {
      if (a.position < b.position) {
        return -1
      } else if (a.position > b.position) {
        return 1
      }

      return a.id.localeCompare(b.id)
    })
  }
  return allChannels
}

