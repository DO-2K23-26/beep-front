import { ReactNode } from 'react'
import { ModifyTextSetting } from './modify-text-setting'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4 bg-violet-300 rounded-md p-4">
      <ModifyTextSetting
        title={t('settings.components.modify-username-email.username')}
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
