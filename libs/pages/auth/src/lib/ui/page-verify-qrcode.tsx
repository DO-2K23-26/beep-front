import { useTranslation } from 'react-i18next'
import { AuthHeader } from './auth-header'
import AuthButton from './auth-button'

interface PageQRCodeVerifyProps {
  error: boolean
  onSignin: () => void
}

export default function PageQRCodeVerify({
  error,
  onSignin,
}: PageQRCodeVerifyProps) {
  const { t } = useTranslation()

  const title = error
    ? t('auth.page-verify-qrcode.error')
    : t('auth.page-verify-qrcode.success')
  const description = error
    ? t('auth.page-verify-qrcode.expiration')
    : t('auth.page-verify-qrcode.description')

  return (
    <div className="flex flex-col gap-12 z-10 max-w-3xl">
      <AuthHeader title={title} />
      <div className="flex flex-col sm:flex-row justify-between item sm:items-center gap-6 sm:gap-12">
        <p className="text-text-grayV2 text-sm font-bold">{description} </p>
        <AuthButton
          onSubmit={onSignin}
          text={t('auth.page-verify-qrcode.homepage')}
        />
      </div>
    </div>
  )
}
