import { ReactNode } from 'react'
import { ModifyUsernameEmail } from './modify-username-email'

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
    <div className="flex flex-col items-center sm:items-start gap-8 bg-violet-400 p-2 sm:p-4 md:p-6 rounded-lg">
      <div>{pictureButtonModal}</div>
      <div className='w-full'>
        <ModifyUsernameEmail
          username={username}
          email={email}
          usernameButtonModal={usernameButtonModal}
          emailButtonModal={emailButtonModal}
        />
      </div>
    </div>
  )
}
