import { Icon } from '@iconify/react'
import { useTranslation } from 'react-i18next'

export function EmptyPinnedMessageList() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col justify-center items-center space-y-4 w-full h-full p-2">
      <Icon icon="lucide:message-circle-x" className="size-10" color=""></Icon>
      <div className="text-center font-semibold text-violet-950 px-4">
        {t('channels.empty-pinned-messages.no_pinned_messages')}
      </div>
    </div>
  )
}
