import { useTranslation } from 'react-i18next'
import { AuthHeader } from './auth-header'
import AuthButton from './auth-button'

interface PageConfirmEmailProps {
  onSignin: () => void
}

export default function PageConfirmEmail({ onSignin }: PageConfirmEmailProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-12 z-10 max-w-3xl">
      <AuthHeader title={t('auth.page-confirm-email.title')} />
      <div className="flex flex-col sm:flex-row justify-between item sm:items-center gap-6 sm:gap-12">
        <p className="text-text-grayV2 text-sm font-bold">
          {t('auth.page-confirm-email.description')}
        </p>
        <AuthButton
          onSubmit={onSignin}
          text={t('auth.page-confirm-email.next')}
        />
      </div>
    </div>
  )
}
