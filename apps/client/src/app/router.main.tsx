import { ReactElement } from 'react'

interface RouteProps {
  path: string
  component: ReactElement
  layout: boolean
}

export const ROUTER: RouteProps[] = []
