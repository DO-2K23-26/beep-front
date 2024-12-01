import { Icon } from '@beep/ui'
import { useTranslation } from 'react-i18next'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EmptyServerPageProps {}

export function EmptyServerPage() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col w-full h-full items-center">
      <div className="flex flex-col justify-center items-center place-content-center h-full w-full sm:w-2/3 md:w-1/2 space-y-4 p-2">
        <Icon
          name="lucide:message-circle-x"
          className="size-12 sm:size-16 md:size-20"
        ></Icon>
        <div className=" text-base sm:text-lg md:text-2xl font-semibold text-violet-950 text-center">
          {t('channels.empty-server-page.title')}
        </div>
        <div className="hidden sm:flex text-base sm:text-lg md:text-2xl  text-violet-950 text-center">
          {t('channels.empty-server-page.description')}
        </div>
      </div>
    </div>
  )
}
