import { Button } from '@beep/shadcn'
import ContainerLight from './container-light'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AuthHeader } from './auth-header'

export interface PageEmailUpdateConfirmation {
  state: 'pending' | 'error' | 'success'
  onErrorClick: () => void
}

export function PageEmailUpdateConfirmation({
  state,
  onErrorClick,
}: PageEmailUpdateConfirmation) {
  let title = ''
  let subtitle = ''
  const { t } = useTranslation()

  switch (state) {
    case 'pending':
      title = t('auth.page-email-update-confirmation.wait')
      break
    case 'success':
      title = t('auth.page-email-update-confirmation.wait')
      subtitle = t('auth.page-email-update-confirmation.redirect')
      break
    default:
      title = t('auth.page-email-update-confirmation.error1')
      subtitle = t('auth.page-email-update-confirmation.error2')
      break
  }

  return (
    <div className="flex flex-col gap-12 z-10 max-w-3xl">
      <AuthHeader title={title} />
      <div className="flex flex-col sm:flex-row justify-between item sm:items-center gap-6 sm:gap-12">
        <p className="text-text-grayV2 text-sm font-bold">{subtitle}</p>
        {state === 'error' ? (
          <Button variant={'signin'} size={'signin'} onClick={onErrorClick}>
            <p className="font-bold text-whiteV2">
              {t('auth.page-email-update-confirmation.button')}
            </p>
            <ArrowRight
              className="w-6 h-6 text-whiteV2 font-bold"
              color="#FF82B6"
            />
          </Button>
        ) : null}
      </div>
    </div>
  )
}
