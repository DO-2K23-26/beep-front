type MediaType =
  | 'youtube'
  | 'spotify'
  | 'appleMusic'
  | 'instagram'
  | 'tiktok'
  | 'twitter'
  | 'else'

interface Media {
  type: MediaType
  id: string
}

const instagramRegex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/p\/([\w-]+)/
const tiktokRegex =
  /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@[\w.-]+\/video\/(\d+)/
const tiktokShortRegex = /(?:https?:\/\/)?(?:vm\.tiktok\.com\/)([\w\d]+)/

const twitterRegex =
  /(?:https?:\/\/)?(?:www\.)?twitter\.com\/(?:#!\/)?(\w+)\/status\/(\d+)/
const youtubeRegex =
  /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=)|youtu\.be\/)([\w\\-]{11})/
const spotifyRegex =
  /(?:https?:\/\/)?(?:open\.spotify\.com\/(?:track|album|playlist)\/|spotify:(?:track|album|playlist):)([\w\d]+)/
const appleMusicRegex =
  /(?:https?:\/\/)?(?:music\.apple\.com\/(?:[a-z]{2}\/)?(?:album|playlist|track)\/[\w\\-]+\/)(\d+)/

export const detectMedia = (text: string): Media | null => {
  const youtubeMatch = text.match(youtubeRegex)
  const spotifyMatch = text.match(spotifyRegex)
  const appleMusicMatch = text.match(appleMusicRegex)
  const instagramMatch = text.match(instagramRegex)
  const tiktokMatch = text.match(tiktokRegex)
  const tiktokShortMatch = text.match(tiktokShortRegex)
  const twitterMatch = text.match(twitterRegex)

  if (youtubeMatch) {
    return { type: 'youtube', id: youtubeMatch[1] }
  } else if (spotifyMatch) {
    return { type: 'spotify', id: spotifyMatch[1] }
  } else if (appleMusicMatch) {
    return { type: 'appleMusic', id: appleMusicMatch[1] }
  } else if (instagramMatch) {
    return { type: 'instagram', id: instagramMatch[1] }
  } else if (tiktokMatch) {
    return { type: 'tiktok', id: tiktokMatch[1] }
  } else if (tiktokShortMatch) {
    return { type: 'tiktok', id: tiktokShortMatch[1] }
  } else if (twitterMatch) {
    return { type: 'twitter', id: twitterMatch[2] }
  }
  return { type: 'else', id: text }
}
