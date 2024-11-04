enum MediaType {
  youtube = 'youtube',
  spotify = 'spotify',
  appleMusic = 'appleMusic',
  instagram = 'instagram',
  tiktok = 'tiktok',
  twitter = 'twitter',
  else = 'else'
}
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
  // Maybe each media should be a list of { regex: regex, type: MediaType }
  const regexMap: { [key: string]: { regex: RegExp; type: MediaType } } = {
    youtube: { regex: youtubeRegex, type: MediaType.youtube },
    spotify: { regex: spotifyRegex, type: MediaType.spotify },
    appleMusic: { regex: appleMusicRegex, type: MediaType.appleMusic },
    instagram: { regex: instagramRegex, type: MediaType.instagram },
    tiktok: { regex: tiktokRegex, type: MediaType.tiktok },
    tiktokShort: { regex: tiktokShortRegex, type: MediaType.tiktok },
    twitter: { regex: twitterRegex, type: MediaType.twitter },
  }

  // You could easily return a list of media
  for (const key in regexMap) {
    const match = text.match(regexMap[key].regex)
    if (match) {
      return { type: regexMap[key].type, id: match[1] }
    }
  }

  return { type: MediaType.else, id: text }
}
