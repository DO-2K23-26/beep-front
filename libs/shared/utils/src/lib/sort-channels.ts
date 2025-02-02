import { ChannelEntity } from '@beep/contracts'

export function sortChannels(
  channels: ChannelEntity[]
): ChannelEntity[] {
  return [...channels].sort((a, b) => {
      if (a.position < b.position) {
        return -1
      } else if (a.position > b.position) {
        return 1
      }

      return a.id.localeCompare(b.id)
    })

}

