export interface PageSignupProps {
  handleSignupEvent: (e: React.FormEvent<HTMLFormElement>) => void
  //   setEmail: Dispatch<SetStateAction<string>>
  email: string
  motdepasse: string
  //   setMotdepasse: Dispatch<SetStateAction<string>>
  loading?: boolean
  error?: string
}

export function PageSignup({
  handleSignupEvent,
  //   setEmail,
  email,
  motdepasse,
  //   setMotdepasse,
  error,
  loading,
}: PageSignupProps) {
  return (
    <div>
      <p>Login init</p>
    </div>
  )
}
