import { ChannelEntity } from '@beep/contracts'
export interface NavigationProps {
  channels?: ChannelEntity[]
}

export function Navigation({ channels }: NavigationProps) {
  return (
    <div>
      <p>Init</p>
    </div>
  )
}
