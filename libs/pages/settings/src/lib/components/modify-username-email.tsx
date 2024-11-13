import { ReactNode } from 'react'
import { ModifyTextSetting } from './modify-text-setting'

interface ModifyUsernameEmailProps {
  username: string
  email: string
  firstname: string
  lastname: string
  usernameButtonModal: ReactNode
  emailButtonModal: ReactNode
  firstnameButtonModal: ReactNode
  lastnameButtonModal: ReactNode
}

export function ModifyUsernameEmail({
  username,
  email,
  firstname,
  lastname,
  usernameButtonModal,
  emailButtonModal,
  firstnameButtonModal,
  lastnameButtonModal,
}: ModifyUsernameEmailProps) {
  return (
    <div className="flex flex-col gap-4 bg-violet-300 rounded-md p-4">
      <ModifyTextSetting
        title={'Username'}
        value={username}
        modalButton={usernameButtonModal}
      />
      <ModifyTextSetting
        title={'First name'}
        value={firstname}
        modalButton={firstnameButtonModal}
      />
      <ModifyTextSetting
        title={'Last name'}
        value={lastname}
        modalButton={lastnameButtonModal}
      />
      <ModifyTextSetting
        title={'Email'}
        value={email}
        modalButton={emailButtonModal}
      />
    </div>
  )
}
