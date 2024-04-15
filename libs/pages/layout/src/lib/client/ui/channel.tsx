import { Button, Icon, LoaderSpinner } from '@beep/ui'

export interface ChannelProps {
  text: string
  iconLeft: string
  iconLeftClassName?: string
  iconRight: string
  iconRightClassName?: string
  className?: string
  onClick?: () => void
  loading?: boolean
}

export function Channel(props: ChannelProps) {
  const {
    text,
    iconLeft,
    iconLeftClassName = '',
    iconRight,
    iconRightClassName = '',
    className = '',
    onClick,
    loading = false,
  } = props

  return !loading ? (
    <Button className={className} onClick={onClick}>
      <Icon name={iconLeft} className={iconLeftClassName} />
      {text}
      <Icon name={iconRight} className={iconRightClassName} />
    </Button>
  ) : (
    <LoaderSpinner theme="dark" />
  )
}
