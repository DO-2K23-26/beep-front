import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@beep/ui'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { QRCodeSVG } from 'qrcode.react'
interface LinkAuthenticatorAppProps {
  totpURI: string
  button: ReactNode
  codeField: ReactNode
}

export function LinkAuthenticatorApp({
  totpURI,
  button,
  codeField,
}: LinkAuthenticatorAppProps) {
  const { t } = useTranslation()
  const secret = URL.parse(totpURI)
    ?.searchParams.get('secret')
    ?.split('')
    .map((val, index) => {
      if (index % 4 === 3) {
        return val + ' '
      }
      return val
    })
    .join('')
  return (
    <DialogContent title="Dialog" className="sm:max-w-[425px] bg-violet-50">
      <DialogHeader>
        <DialogTitle>
          {t('layout.security-settings.link-authenticator.title')}
        </DialogTitle>
        <DialogDescription>
          <p className="text-slate-500">
            {t('layout.security-settings.link-authenticator.subtitle')}
          </p>
        </DialogDescription>
      </DialogHeader>
      {/* {children} */}

      <div className="flex flex-row gap-5">
        <QRCodeSVG
          className="h-full w-full bg-white p-2 rounded-md"
          value={totpURI}
        />
        <div className="flex gap-4 flex-col">
          <div className="flex flex-col gap-2">
            <h3 className="text-base font-semibold leading-none tracking-tight">
              {t('layout.security-settings.link-authenticator.scan')}
            </h3>
            <p className="text-slate-500">
              {t(
                'layout.security-settings.link-authenticator.scan-description'
              )}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-base font-semibold leading-none tracking-tight">
              {t('layout.security-settings.link-authenticator.2fa')}
            </h3>
            <code className="text-slate-500 text-sm">{secret}</code>
          </div>
        </div>
      </div>
      <hr />
      <div className="flex gap-2 flex-col">
        <h3 className="text-base font-semibold leading-none tracking-tight">
          {t('layout.security-settings.link-authenticator.2fa')}
        </h3>

        <p className="text-slate-500">
          {t('layout.security-settings.link-authenticator.scan-description')}
        </p>
        {codeField}
      </div>

      <DialogFooter>{button}</DialogFooter>
    </DialogContent>
  )
}
