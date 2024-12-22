import { useTranslation } from 'react-i18next'
import { AuthHeader } from './auth-header'
import AuthButton from './auth-button'

interface PageVerifyProps {
  stateVerification: boolean
  loading: boolean
  onClickButton: () => void
}

export const PageVerify: React.FC<PageVerifyProps> = ({
  stateVerification,
  loading,
  onClickButton,
}) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-12 z-10 max-w-3xl">
      <AuthHeader title={t('auth.page-verify.account_verification')} />
      <div className="flex flex-col sm:flex-row justify-between item sm:items-center gap-6 sm:gap-12">
        {loading ? (
          <p className="text-text-grayV2 text-sm font-bold">
            {t('auth.page-verify.loading')}
          </p>
        ) : (
          <>
            {stateVerification ? (
              <p className="text-text-grayV2 text-sm font-bold">
                {t('auth.page-verify.verified_account')}
              </p>
            ) : (
              <p className="text-text-grayV2 text-sm font-bold">
                {t('auth.page-verify.invalid-token')}
              </p>
            )}
            <AuthButton
              onSubmit={onClickButton}
              text={t('auth.page-verify.button')}
            />
          </>
        )}
      </div>
    </div>
  )
}
