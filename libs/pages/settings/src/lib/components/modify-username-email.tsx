import { ReactNode } from 'react'
import { ModifyTextSetting } from './modify-text-setting'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4 bg-violet-300 rounded-md p-4">
      <ModifyTextSetting
        title={t('settings.components.modify-username-email.firstName')}
        value={firstName}
        modalButton={firstnameButtonModal}
      />
      <ModifyTextSetting
        title={t('settings.components.modify-username-email.lastName')}
        value={lastName}
        modalButton={lastnameButtonModal}
      />
      <ModifyTextSetting
        title={t('settings.components.modify-username-email.username')}
        value={username}
        modalButton={usernameButtonModal}
      />
      <ModifyTextSetting
        title={t('settings.components.modify-username-email.email')}
        value={email}
        modalButton={emailButtonModal}
      />
    </div>
  )
}
