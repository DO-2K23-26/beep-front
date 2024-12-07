import { Enable2FADialog } from '@beep/settings'
import { Button, ButtonStyle, SettingBadge } from '@beep/ui'
import { useTranslation } from 'react-i18next'
import { AskPasswordStep } from './security-settings/ask-password'
import { AskPasswordStepFeature } from '../feature/security-settings/ask-password-feature'
import { nextDay } from 'date-fns'
import { useCallback, useState } from 'react'
import { Step } from '../feature/security-setting-feature'

interface SecuritySettingProps {
  isModalOpen: boolean
  setIsModalOpen: (value: boolean) => void
  action: () => void
  totpAuthentication: boolean
  step: Step
  disable2FA: () => void
}

export function SecuritySetting({
  isModalOpen,
  setIsModalOpen,
  action,
  step,
  disable2FA,
  totpAuthentication,
}: SecuritySettingProps) {
  const { t } = useTranslation()

  return (
    <div className="p-6 flex flex-col gap-8">
      <h2 className="text-base sm:text-xl md:text-3xl text-slate-700 font-bold mb-2 max-w-sm">
        🛡️ {t('layout.current-user.security')}
      </h2>
      <div className="flex flex-col gap-5">
        <h3 className="text-base sm:text-lg md:text-xl text-slate-700 font-bold mb-2 max-w-sm p-0 m-0 flex flex-row w-full items-center gap-3">
          {t('layout.security-settings.tfa-n-activated.subtitle')}
          {totpAuthentication ? (
            <SettingBadge color="SUCCESS" label={t('globals.activated')} />
          ) : (
            <SettingBadge color="DANGER" label={t('globals.not-activated')} />
          )}
        </h3>
        <p className="text-slate-800 text-xs sm:text-sm md:text-base">
          {totpAuthentication
            ? t('layout.security-settings.tfa-activated.description')
            : t('layout.security-settings.tfa-n-activated.description')}{' '}
          <a
            className="text-violet-700 hover:underline"
            href="https://en.wikipedia.org/wiki/Multi-factor_authentication"
            aria-label="Multi factor authentication (wikipedia)"
            target="_blank"
            rel="noreferrer"
          >
            {t('layout.security-settings.tfa-n-activated.learn-more')}
          </a>
        </p>
        <span>
          {totpAuthentication ? (
            <Button
              style={ButtonStyle.ERROR}
              onClick={() => {
                disable2FA()
              }}
            >
              {t('layout.security-settings.tfa-activated.cta')}
            </Button>
          ) : (
            <Enable2FADialog
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              action={action}
              step={step}
              trigger={
                <Button>
                  {t('layout.security-settings.tfa-n-activated.cta')}
                </Button>
              }
            />
          )}
        </span>
      </div>
    </div>
  )
}
