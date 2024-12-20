import { Children, cloneElement, isValidElement, ReactNode } from 'react'
import { Tag } from '../ui/tag'
import { ChannelEntity, UserDisplayedEntity } from '@beep/contracts'

const regexUserTagging =
  /@\$[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i

const regexChannelTagging =
  /#\$[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i

type DisplayedEntity = UserDisplayedEntity | ChannelEntity

const replaceTextByTag = (
  text: string,
  regex: RegExp,
  prefix: string,
  findEntity: (entity: string) => DisplayedEntity | undefined,
  onClick: (entity: DisplayedEntity) => void
): ReactNode => {
  const parts: ReactNode[] = []
  let lastIndex = 0

  text.replace(regex, (match, offset) => {
    const entity = findEntity(match)
    parts.push(text.slice(lastIndex, offset))
    parts.push(
      <Tag
        prefix={prefix}
        entity={entity ?? null}
        onClick={() => entity && onClick(entity)}
      />
    )
    lastIndex = offset + match.length
    return match
  })

  parts.push(text.slice(lastIndex))
  return parts
}

const recurseChildren = (
  node: ReactNode,
  regex: RegExp,
  prefix: string,
  findEntity: (entity: string) => DisplayedEntity | undefined,
  onClick: (entity: DisplayedEntity) => void
): ReactNode => {
  if (typeof node === 'string') {
    return replaceTextByTag(node, regex, prefix, findEntity, onClick)
  } else if (isValidElement(node)) {
    return cloneElement(
      node,
      {},
      Children.map(node.props.children, (child) =>
        recurseChildren(child, regex, prefix, findEntity, onClick)
      )
    )
  } else if (Array.isArray(node)) {
    return node.map(() =>
      recurseChildren(node, regex, prefix, findEntity, onClick)
    )
  } else {
    return node
  }
}

export {
  DisplayedEntity,
  recurseChildren,
  replaceTextByTag,
  regexChannelTagging,
  regexUserTagging,
}
