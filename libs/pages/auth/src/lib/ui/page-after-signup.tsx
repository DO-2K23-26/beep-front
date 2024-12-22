import { Button } from '@beep/shadcn'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AuthHeader } from './auth-header'

interface PageAfterSignupProps {
  onSignin: () => void
}

export default function PageAfterSignup({ onSignin }: PageAfterSignupProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-12 z-10 max-w-3xl">
      <AuthHeader title={t('auth.page-after-signup.title')} />
      <div className="flex flex-col sm:flex-row justify-between item sm:items-center gap-6 sm:gap-12">
        <p className="text-text-grayV2 text-sm font-bold">
          {t('auth.page-after-signup.description')}
        </p>
        <Button variant={'signin'} size={'signin'} onClick={onSignin}>
          <p className="font-bold text-whiteV2">
            {t('auth.page-after-signup.button')}
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
