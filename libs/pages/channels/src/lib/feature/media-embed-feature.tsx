enum MediaType {
  youtube = 'youtube',
  spotify = 'spotify',
  spotifyAlbum = 'spotifyAlbum',
  spotifyPlaylist = 'spotifyPlaylist',
  appleMusic = 'appleMusic',
  instagram = 'instagram',
  tiktok = 'tiktok',
  twitter = 'twitter',
  else = 'else',
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
const spotifyTrackRegex =
  /(?:https?:\/\/)?(?:open\.spotify\.com\/intl-\w+\/track\/)([\w\d]{22})\?si=[\w\d]{16}/
const spotifyAlbumRegex = /(?:https?:\/\/)?(?:open\\.spotify\\.com\/album\/|spotify:album:)([\\w\\d]+)/;
const spotifyPlaylistRegex = /(?:https?:\/\/)?(?:open\\.spotify\\.com\/playlist\/|spotify:playlist:)([\\w\\d]+)/;
const appleMusicRegex =
  /(?:https?:\/\/)?(?:music\.apple\.com\/(?:[a-z]{2}\/)?(?:album|playlist|track)\/[\w\\-]+\/)(\d+)/

export const detectMedia = (text: string): Media[] => {
  const regexMap: { [key: string]: { regex: RegExp; type: MediaType } } = {
    youtube: { regex: youtubeRegex, type: MediaType.youtube },
spotifyTrack: { regex: spotifyTrackRegex, type: MediaType.spotify },
    spotifyAlbum: { regex: spotifyAlbumRegex, type: MediaType.spotifyAlbum },
    spotifyPlaylist: { regex: spotifyPlaylistRegex, type: MediaType.spotifyPlaylist },
        appleMusic: { regex: appleMusicRegex, type: MediaType.appleMusic },
    instagram: { regex: instagramRegex, type: MediaType.instagram },
    tiktok: { regex: tiktokRegex, type: MediaType.tiktok },
    tiktokShort: { regex: tiktokShortRegex, type: MediaType.tiktok },
    twitter: { regex: twitterRegex, type: MediaType.twitter },
  }

  const detectedMedia: Media[] = []

  for (const key in regexMap) {
    let match
    while ((match = text.match(regexMap[key].regex)) !== null) {
      detectedMedia.push({ type: regexMap[key].type, id: match[1] })
      // Remove the detected portion to prevent infinite loops
      text = text.replace(match[0], '')
    }
  }

  if (detectedMedia.length === 0) {
    return [{ type: MediaType.else, id: text }]
  }

  return detectedMedia
}
