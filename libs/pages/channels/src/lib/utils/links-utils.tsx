// utils/link-utils.ts

import React from 'react'

export const renderTextWithLinks = (text: string) => {
  const urlPattern = /(https?:\/\/[^\s]+)/g
  return text.split(urlPattern).map((part, index) => {
    if (part.match(urlPattern)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {part}
        </a>
      )
    }
    return part
  })
}

