interface AuthHeaderProps {
  title: string
  description?: string
}

export function AuthHeader({ title, description }: AuthHeaderProps) {
  const version = 'BEEP 0.1'

  return (
    <div className="flex flex-col gap-3">
      <p className="font-bold text-grayV2">{version}</p>
      <h1 className="font-extrabold text-whiteV2">{title}</h1>
      {description && <p className="text-text-grayV2">{description}</p>}
    </div>
  )
}
