export interface PageLoginProps {
  onSubmit: () => void
  loading?: boolean
}

export function PageLogin({ onSubmit, loading }: PageLoginProps) {
  //appelle useform control

  //   const { control, getFieldState } = useFormContext()
  return (
    <div>
      <p>Login init</p>
    </div>
  )
}
