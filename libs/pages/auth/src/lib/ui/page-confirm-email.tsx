import { useTranslation } from 'react-i18next'
import { Button } from '@beep/shadcn'
import { ArrowRight } from 'lucide-react'
import { AuthHeader } from './auth-header'

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
        <Button variant={'signin'} size={'signin'} onClick={onSignin}>
          <p className="font-bold text-whiteV2">
            {t('auth.page-confirm-email.next')}
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
