import { ReactNode } from 'react'
import { ModifyTextSetting } from './modify-text-setting'

interface ModifyUsernameEmailProps {
  username: string
  email: string
  firstName: string
  lastName: string
  usernameButtonModal: ReactNode
  emailButtonModal: ReactNode
  firstnameButtonModal: ReactNode
  lastnameButtonModal: ReactNode
}

export function ModifyUsernameEmail({
  username,
  email,
  firstName,
  lastName,
  usernameButtonModal,
  emailButtonModal,
  firstnameButtonModal,
  lastnameButtonModal,
}: ModifyUsernameEmailProps) {
  return (
    <div className="flex flex-col gap-4 bg-violet-300 rounded-md p-4">
      <ModifyTextSetting
        title={'First name'}
        value={firstName}
        modalButton={firstnameButtonModal}
      />
      <ModifyTextSetting
        title={'Last name'}
        value={lastName}
        modalButton={lastnameButtonModal}
      />
      <ModifyTextSetting
        title={'Username'}
        value={username}
        modalButton={usernameButtonModal}
      />
      <ModifyTextSetting
        title={'Email'}
        value={email}
        modalButton={emailButtonModal}
      />
    </div>
  )
}
