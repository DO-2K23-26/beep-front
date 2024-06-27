import { ReactNode, createElement } from 'react'

export * from './lib/sort-by-key'
export * from './lib/tw-merge'
export * from './lib/transmit'

type ReactElementProps = {
  tag: (...props: unknown[]) => JSX.Element
  children?: ReactNode | JSX.Element
  [props: string]: any
}

export const uid = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function ReactElement({
  tag,
  children,
  ...props
}: ReactElementProps): JSX.Element {
  return createElement(tag, props, children)
}

export function around(x: number): number {
  return Math.round(100 * x) / 100
}

export const upperCaseFirstLetter = (string: string | undefined) =>
  string &&
  `${string.slice(0, 1).toUpperCase()}${string.toLowerCase().slice(1)}`
