
export function sortEntity<T extends {
  id: string
  position: number
}>(
  channels: T[]
): T[] {
  return [...channels].sort((a, b) => {
      if (a.position < b.position) {
        return -1
      } else if (a.position > b.position) {
        return 1
      }

      return a.id.localeCompare(b.id)
    })

}

