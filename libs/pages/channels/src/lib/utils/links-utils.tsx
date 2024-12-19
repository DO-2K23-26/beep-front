import { MessageEntity } from '@beep/contracts'

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
          className="text-blue-500 hover:underline break-all"
        >
          {part}
        </a>
      )
    }
    return part
  })
}

export function containsUrl(message: MessageEntity): boolean {
  return /https?:\/\/[^\s]+/.test(message.content)
}
