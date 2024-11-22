import { ChannelEntity, UserDisplayedEntity } from '@beep/contracts'
import { DisplayedEntity } from '../utils/tagging-utils'
import { useTranslation } from 'react-i18next'

interface TagProps<T> {
  entity: T | null
  prefix: string
  onClick: (entity: T) => void
}

export function Tag<T extends DisplayedEntity>({
  entity,
  prefix,
  onClick,
}: TagProps<T>) {
  const { t } = useTranslation()

  let displayedName = ''

  if (isUserDisplayedEntity(entity)) {
    displayedName = entity.username
  } else if (isChannelEntity(entity)) {
    displayedName = entity.name
  }

  function isUserDisplayedEntity(entity: any): entity is UserDisplayedEntity {
    return entity && typeof entity.username === 'string'
  }

  function isChannelEntity(entity: any): entity is ChannelEntity {
    return entity && typeof entity.name === 'string'
  }
  return (
    <span
      className={
        'bg-violet-300 p-1 rounded ' + (entity ? 'cursor-pointer' : '')
      }
      onClick={() => entity && onClick(entity)}
    >
      {entity ? prefix + displayedName : t('channels.tag.undefined')}
    </span>
  )
}
