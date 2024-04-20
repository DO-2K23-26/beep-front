import {
  ChannelEntity,
  ChannelType
} from '@beep/contracts'
import { PropsWithChildren } from 'react'
import LayoutPage from '../ui/layout-page'

const channels: ChannelEntity[] = [
  {
    id: '1',
    name: 'Test',
    server_id: '13',
    type: ChannelType.TEXT,
  },
]

export function Layout({ children }: PropsWithChildren) {
  return <LayoutPage channels={channels}>{children}</LayoutPage>
}
