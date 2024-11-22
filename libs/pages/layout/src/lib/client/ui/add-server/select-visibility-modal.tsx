import { Button, Icon } from '@beep/ui'
import { useTranslation } from 'react-i18next'

interface SelectVisibilityModalProps {
  createPrivateServer: () => void
  createPublicServer: () => void
}

export default function SelectVisibilityModal({
  createPrivateServer,
  createPublicServer,
}: SelectVisibilityModalProps) {
  const { t } = useTranslation()

  return (
    <div className="p-7 flex flex-col gap-5">
      <span className="flex flex-col gap-2">
        <h3 className="font-bold">
          {t('layout.add-server.select-visibility-modal.additional_details')}
        </h3>
      </span>

      <Button resize onClick={createPrivateServer} className="!px-3 !py-7">
        <span className="flex flex-row w-full justify-between">
          <span className="flex flex-row">
            <Icon name="material-symbols:lock-outline" className="mr-2" />
            <span className="text-left">
              <p>
                {t('layout.add-server.select-visibility-modal.create_server', {
                  visibility: t(
                    'layout.add-server.select-visibility-modal.private'
                  ),
                })}
              </p>
              <p className="text-left mr-0 text-xs opacity-50 font-normal">
                {t(
                  'layout.add-server.select-visibility-modal.for_you_and_friends'
                )}
              </p>
            </span>
          </span>
          <Icon name="lucide:chevron-right" className="mr-2" />
        </span>
      </Button>
      <span className="flex flex-row items-center">
        <div className="border-t border-gray-300 w-1/2"></div>
        <p className="px-3">
          {t('layout.add-server.select-visibility-modal.or')}
        </p>
        <div className="border-t border-gray-300 w-1/2"></div>
      </span>
      <Button resize onClick={createPublicServer} className="!px-3 !py-7">
        <span className="flex flex-row w-full justify-between">
          <span className="flex flex-row">
            <Icon name="ri:team-line" className="mr-2" />
            <span className="text-left">
              <p>
                {t('layout.add-server.select-visibility-modal.create_server', {
                  visibility: t(
                    'layout.add-server.select-visibility-modal.public'
                  ),
                })}
              </p>
              <p className="text-left mr-0 text-xs opacity-50 font-normal">
                {t(
                  'layout.add-server.select-visibility-modal.build_your_community'
                )}
              </p>
            </span>
          </span>
          <Icon name="lucide:chevron-right" className="mr-2" />
        </span>
      </Button>
    </div>
  )
}
