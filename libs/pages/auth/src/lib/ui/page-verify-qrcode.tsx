import { Button } from '@beep/shadcn'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { AuthHeader } from './auth-header'

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
        <Button variant={'signin'} size={'signin'} onClick={onSignin}>
          <p className="font-bold text-whiteV2">
            {t('auth.page-verify-qrcode.homepage')}
          </p>
          <ArrowRight
            className="w-6 h-6 text-whiteV2 font-bold"
            color="#FF82B6"
          />
        </Button>
      </div>
    </div>
  )
}
