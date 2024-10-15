import { Children, cloneElement, isValidElement, ReactNode } from 'react'
import { Tag } from '../ui/tag'
import { UserDisplayedEntity } from '@beep/contracts'

const regexUserTagging =
  /@\$[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi

const replaceTextByTag = (
  text: string,
  findEntity: (entity: any) => any
): ReactNode => {
  const parts: ReactNode[] = []
  let lastIndex = 0

  text.replace(regexUserTagging, (match, offset) => {
    const user = taggedUsers.find((u) => u.id === match.slice(2))
    parts.push(text.slice(lastIndex, offset))
    parts.push(
      Tag({
        entity: user,
        displayedName: user?.username ?? '',
        onClick: () => onClickTagUser(user as UserDisplayedEntity),
      })
    )
    lastIndex = offset + match.length
    return match
  })

  parts.push(text.slice(lastIndex))
  return parts
}

const recurseChildren = (node: ReactNode): ReactNode => {
  if (typeof node === 'string') {
    return replaceText(node)
  } else if (isValidElement(node)) {
    return cloneElement(
      node,
      {},
      Children.map(node.props.children, (child) => recurseChildren(child))
    )
  } else if (Array.isArray(node)) {
    return node.map(recurseChildren)
  } else {
    return node
  }
}

export { recurseChildren, regexUserTagging }
