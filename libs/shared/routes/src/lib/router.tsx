import { type ReactNode } from 'react'

export * from './sub-router/login.router'

export interface Route {
  component: ReactNode
  path: string
}
