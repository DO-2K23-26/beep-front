import { ModifyUsernameEmail } from '@beep/settings'
import { ReactNode } from 'react'

interface ModifyProfileCardProps {
  username: string
  email: string
  usernameButtonModal: ReactNode
  emailButtonModal: ReactNode
  pictureButtonModal: ReactNode
}

export function ModifyProfileCard({
  username,
  email,
  usernameButtonModal,
  emailButtonModal,
  pictureButtonModal,
}: ModifyProfileCardProps) {
  return (
    <div className="flex flex-col gap-8 bg-violet-400 p-6 rounded-lg">
      <div className="flew flex-row">{pictureButtonModal}</div>
      <ModifyUsernameEmail
        username={username}
        email={email}
        usernameButtonModal={usernameButtonModal}
        emailButtonModal={emailButtonModal}
      />
    </div>
  )
}
