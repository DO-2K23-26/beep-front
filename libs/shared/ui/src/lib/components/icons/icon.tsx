import IconFa from "./icon-fa/icon-fa"

export interface IconProps {
  name: string
  width?: string
  height?: string
  viewBox?: string
  className?: string
  pathColor?: string
}


export function Icon(props: IconProps) {
  const formattedProps = { ...props }

  formattedProps.width = formattedProps.width ?? '1.5rem'
  formattedProps.viewBox = formattedProps.viewBox ?? '0 0 24 24'
  formattedProps.className = 'shrink-0 ' + (formattedProps.className ?? '')


  switch (props.name) {
    default:
      return <IconFa {...formattedProps} />
  }
}
