import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function PageQRCodeVerify({ error }: { error: boolean }) {
  const { t } = useTranslation()

  if (error) {
    return (
      <div className="flex flex-col gap-6 justify-center items-start m-5">
        <h1 className="font-extrabold">{t('auth.page-verify-qrcode.error')}</h1>
        <div className="flex flex-row gap-2 items-center">
          <h5>{t('auth.page-verify-qrcode.expiration')}</h5>
        </div>
        <Link to="/" className="text-black underline">
          {t('auth.page-verify-qrcode.homepage')}
        </Link>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-6 justify-center items-start m-5">
      <h1 className="font-extrabold">{t('auth.page-verify-qrcode.success')}</h1>
      <div className="flex flex-row gap-2 items-center">
        <h5>{t('auth.page-verify-qrcode.description')}</h5>
      </div>
      <Link to="/" className="text-black underline">
        {t('auth.page-verify-qrcode.homepage')}
      </Link>
    </div>
  )
}
