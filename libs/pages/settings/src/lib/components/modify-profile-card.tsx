import { ReactNode } from 'react'
import { ModifyUsernameEmail } from './modify-username-email'

interface ModifyProfileCardProps {
  username: string
  email: string
  firstName: string
  lastName: string
  usernameButtonModal: ReactNode
  emailButtonModal: ReactNode
  pictureButtonModal: ReactNode
  firstnameButtonModal: ReactNode
  lastnameButtonModal: ReactNode
}

export function ModifyProfileCard({
  username,
  email,
  firstName,
  lastName,
  usernameButtonModal,
  emailButtonModal,
  firstnameButtonModal,
  lastnameButtonModal,
  pictureButtonModal,
}: ModifyProfileCardProps) {
  return (
    <div className="flex flex-col gap-8 bg-violet-400 p-6 rounded-lg">
      <div className="flew flex-row">{pictureButtonModal}</div>
      <ModifyUsernameEmail
        username={username}
        email={email}
        firstName={firstName}
        lastName={lastName}
        usernameButtonModal={usernameButtonModal}
        emailButtonModal={emailButtonModal}
        firstnameButtonModal={firstnameButtonModal}
        lastnameButtonModal={lastnameButtonModal}
      />
    </div>
  )
}
