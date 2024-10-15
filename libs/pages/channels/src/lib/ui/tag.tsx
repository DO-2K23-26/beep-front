interface TagProps<T> {
  entity: T | null
  displayedName: string
  onClick: (entity: T) => void
}

export function Tag<T>({ entity, displayedName, onClick }: TagProps<T>) {
  return (
    <span
      className={
        'bg-violet-300 p-1 rounded ' + (entity ? 'cursor-pointer' : '')
      }
      onClick={() => entity && onClick(entity)}
    >
      {entity ? '@' + displayedName : 'undefined user'}
    </span>
  )
}
