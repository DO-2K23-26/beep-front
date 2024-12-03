import { Button, ButtonStyle } from '@beep/ui'
import { useTranslation } from 'react-i18next'

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
    <div
      className="h-dvh w-full bg-no-repeat bg-cover flex justify-center"
      style={{ backgroundImage: `url('/background.svg')` }}
    >
      <div className="flex flex-col gap-6 justify-center items-start">
        <h1 className="font-extrabold">
          {t('auth.page-verify.account_verification')}
        </h1>
        <div className="underline">
          {loading ? (
            <p>{t('auth.page-verify.loading')}</p>
          ) : (
            <>
              {stateVerification ? (
                <h3>{t('auth.page-verify.verified_account')}</h3>
              ) : (
                <h3>{t('auth.page-verify.invalid-token')}</h3>
              )}
              <div className="mt-6 text-center">
                <Button
                  style={ButtonStyle.STROKED}
                  onClick={() => onClickButton()}
                >
                  {t('auth.page-verify.signin')}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
