import { ReactNode } from 'react'
import { ModifyTextSetting } from './modify-text-setting'

interface ModifyUsernameEmailProps {
  username: string
  email: string
  usernameButtonModal: ReactNode
  emailButtonModal: ReactNode
}

export function ModifyUsernameEmail({
  username,
  email,
  usernameButtonModal,
  emailButtonModal,
}: ModifyUsernameEmailProps) {
  return (
    <div className="flex flex-col gap-4 bg-violet-300 rounded-md p-4">
      <ModifyTextSetting
        title={'Username'}
        value={username}
        modalButton={usernameButtonModal}
      />
      {/* <ModifyTextSetting
        title={'Email'}
        value={email}
        modalButton={emailButtonModal}
      /> */}
    </div>
  )
}
