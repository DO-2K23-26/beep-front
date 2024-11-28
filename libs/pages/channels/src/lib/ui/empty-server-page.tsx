import { Icon as Iconify } from '@iconify/react'
import { useTranslation } from 'react-i18next'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EmptyServerPageProps {}

export function EmptyServerPage() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col w-full justify-start p-6 items-center h-screen">
      <div className="flex flex-col justify-center items-center h-full w-1/2 space-y-4">
        <Iconify
          icon="lucide:message-circle-x"
          className="size-20"
          color=""
        ></Iconify>
        <div className="text-2xl font-semibold text-violet-950 text-center">
          {t('channels.empty-server-page.title')}
        </div>
        <div className="text-2xl  text-violet-950 text-center">
          {t('channels.empty-server-page.description')}
        </div>
      </div>
    </div>
  )
}
