import { Button, ButtonStyle, Icon } from '@beep/ui'
import { useTranslation } from 'react-i18next'

interface PageAfterSignupProps {
  onSignin: () => void
}

export default function PageAfterSignup({ onSignin }: PageAfterSignupProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-6 justify-center items-start">
      <h1 className="font-extrabold">
        {t('auth.page-after-signup.check_email')}
      </h1>
      <div className="flex flex-row gap-2 items-center">
        <h5>{t('auth.page-after-signup.validate_email')} </h5>
        <Button style={ButtonStyle.NONE} onClick={onSignin}>
          <Icon name="lucide:arrow-right" />
        </Button>
      </div>
    </div>
  )
}
