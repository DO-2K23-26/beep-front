// media-embed.tsx

import React from 'react'
import { detectMedia } from '../feature/media-embed-feature'

interface MediaEmbedProps {
  text: string
}

const MediaEmbed: React.FC<MediaEmbedProps> = ({ text }) => {
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
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${media.id}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}

          {media.type === 'spotify' && (
            <iframe
              style={{ borderRadius: '12px' }}
              src={`https://open.spotify.com/embed/track/${media.id}?utm_source=generator`}
              title="Spotify Embed"
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
              style={{ borderRadius: '12px' }}
              src={`https://embed.music.apple.com/us/album/${media.id}`}
              title="AppleMusic Embed"
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
              src={`https://www.instagram.com/p/${media.id}/embed`}
              width="400"
              height="480"
              frameBorder="0"
              allow="encrypted-media"
              allowFullScreen
              title="Instagram Embed"
            ></iframe>
          )}

          {media.type === 'tiktok' && (
            <iframe
              src={`https://www.tiktok.com/embed/v2/${media.id}`}
              width="400"
              height="680"
              frameBorder="0"
              allow="encrypted-media"
              allowFullScreen
              title="TikTok Embed"
            ></iframe>
          )}

          {media.type === 'twitter' && (
            <blockquote className="twitter-tweet">
              <a href={`https://twitter.com/i/web/status/${media.id}`}>
                View the tweet on Twitter
              </a>
            </blockquote>
          )}

          {media.type === 'else' && (
            <blockquote className="url">
              <a href={`${media.id}`}>Click to access the URL</a>
            </blockquote>
          )}
        </div>
      ))}
    </div>
  )
}

export default MediaEmbed
