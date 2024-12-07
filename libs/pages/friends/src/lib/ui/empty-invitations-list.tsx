import { Icon } from '@beep/ui'
import { useTranslation } from 'react-i18next'

export function EmptyInvitationList() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col w-full h-full md:w-1/2 xl:w-1/3 items-center justify-center self-center">
      <Icon
        name="lucide:smile-plus"
        className="size-10 md:size-15 lg:size-20"
      ></Icon>
      <div className="md:text-xl lg:text-2xl font-semibold text-slate-800 text-center">
        {t('friends.empty-invitation-list.title')}
        {/* You have currently no friends */}
      </div>
      <div className="md:text-xl lg:text-2xl text-slate-800 text-center p-2">
        {t('friends.empty-invitation-list.description')}
        {/* You can send invitation to your friends by clicking on "Invitations" */}
      </div>
    </div>
  )
}
