import { useCallback, useEffect, useState } from 'react'
import { SecuritySetting } from '../ui/security-setting'
import { AskPasswordStepFeature } from './security-settings/ask-password-feature'
import { LinkAuthenticatorAppFeature } from './security-settings/link-authenticator-app-feature'
import { useDisable2FAMutation, useGetMeQuery } from '@beep/user'

const useHasTwoFAEnabled = () => {
  return {
    hasTwoFA: false,
  }
}

export interface Step {
  title: string
  content: React.ReactNode
}

export function SecuritySettingFeature() {
  const { hasTwoFA } = useHasTwoFAEnabled()
  const [isModalOpen, setModalOpen] = useState(false)
  const [totpUri, setTotpUri] = useState<string | undefined>(undefined)
  const handleOpenModal = useCallback(() => {
    setModalOpen(true)
  }, [setModalOpen])
  const [step, setStep] = useState(0)

  const { data: me } = useGetMeQuery()

  const [disable2FA] = useDisable2FAMutation()

  const totpAuthentication = me !== undefined ? me.totpAuthentication : false

  useEffect(() => {
    if (totpUri === undefined) return
    setStep(1)
  }, [totpUri])

  const steps: Step[] = [
    {
      title: 'Ask password',
      content: <AskPasswordStepFeature setTotpURI={setTotpUri} />,
    },
    {
      title: 'Next step',
      content: <LinkAuthenticatorAppFeature totpURI={totpUri ?? ''} />,
    },
  ]
  return (
    <SecuritySetting
      totpAuthentication={totpAuthentication}
      isModalOpen={isModalOpen}
      setIsModalOpen={setModalOpen}
      action={handleOpenModal}
      step={steps[step]}
      disable2FA={disable2FA}
    />
  )
}
