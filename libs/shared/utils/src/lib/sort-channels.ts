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

export function getPositionsDuringSwap(
  draggedItem: string,
  swappedItem: string,
  newPositions: string[]
): {
  id: string
  position: number
}[] {
  const toReturn = []
  const posDragged = newPositions.findIndex((elt) => elt === draggedItem)
  const posSwapped = newPositions.findIndex((elt) => elt === swappedItem)

  toReturn.push({
    id: draggedItem,
    position: posDragged,
  })

  toReturn.push({
    id: swappedItem,
    position: posSwapped,
  })

  return toReturn
}

export function getPositionsAfterSwap(
  oldPositions: { slot: string; item: string }[],
  newPositions: { slot: string; item: string }[]
): { id: string; position: number }[] {
  const filtered = newPositions.filter((value) => {
    const old = oldPositions.filter((val) => value.slot === val.slot) //only one elt since slot is unique
    return old[0].item !== value.item
  })
}
