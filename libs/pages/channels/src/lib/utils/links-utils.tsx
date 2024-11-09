// utils/link-utils.ts
export const detectAndEmbedLinks = (text: string) => {
  const urlRegex =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\\/%?=~_|!:,.;]*[-A-Z0-9+&@#\\/%=~_|])/gi
  return text.replace(
    urlRegex,
    (url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
  )
}
