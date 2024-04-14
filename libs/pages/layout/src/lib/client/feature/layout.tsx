import LayoutPage from '../ui/layout-page'
import { PropsWithChildren } from 'react'

export function Layout({ children }: PropsWithChildren) {
  return <LayoutPage>{children}</LayoutPage>
}
