// media-embed.tsx

import React from 'react'
import { detectMedia } from '../feature/media-embed-feature'
import { useTranslation } from 'react-i18next'

interface MediaEmbedProps {
  text: string
}

const MediaEmbed: React.FC<MediaEmbedProps> = ({ text }) => {
  const { t } = useTranslation()

  const mediaList = detectMedia(text)

  if (mediaList.length === 0) {
    return null
  }

  return (
    <div>
      {mediaList.map((media, index) => (
        <div key={index}>
          {media.type === 'youtube' && (
            <iframe
              className="w-full"
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${media.id}`}
              title={t('channels.media-embed.youtube')}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}

          {media.type === 'spotify' && (
            <iframe
              className="w-full"
              style={{ borderRadius: '12px' }}
              src={`https://open.spotify.com/embed/track/${media.id}?utm_source=generator`}
              title={t('channels.media-embed.spotify')}
              width="100%"
              height="152"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            ></iframe>
          )}

          {media.type === 'appleMusic' && (
            <iframe
              className="w-full"
              style={{ borderRadius: '12px' }}
              src={`https://embed.music.apple.com/us/album/${media.id}`}
              title={t('channels.media-embed.apple_music')}
              width="100%"
              height="352"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            ></iframe>
          )}

          {media.type === 'instagram' && (
            <iframe
              className="w-full"
              src={`https://www.instagram.com/p/${media.id}/embed`}
              width="400"
              height="480"
              frameBorder="0"
              allow="encrypted-media"
              allowFullScreen
              title={t('channels.media-embed.instagram')}
            ></iframe>
          )}

          {media.type === 'tiktok' && (
            <iframe
              className="w-fit"
              src={`https://www.tiktok.com/embed/v2/${media.id}`}
              width="400"
              height="680"
              frameBorder="0"
              allow="encrypted-media"
              allowFullScreen
              title={t('channels.media-embed.tiktok')}
            ></iframe>
          )}

          {media.type === 'twitter' && (
            <blockquote className="twitter-tweet">
              <a href={`https://twitter.com/i/web/status/${media.id}`}>
                View the tweet on Twitter
              </a>
            </blockquote>
          )}

          {/* {media.type === 'else' && (
            <blockquote className="url">
              <a href={`${media.id}`}>Click to access the URL</a>
            </blockquote>
          )} */}
        </div>
      ))}
    </div>
  )
}

export default MediaEmbed
