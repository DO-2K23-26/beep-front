import { Icon } from '@beep/ui'
import { useTranslation } from 'react-i18next'

export function EmptyFriendsList() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col w-full md:w-1/2 xl:w-1/3 h-full items-center justify-center self-center">
      <Icon
        name="lucide:user-x"
        className="size-10 md:size-15 lg:size-20"
      ></Icon>
      <div className="md:text-xl lg:text-2xl font-semibold text-slate-800 text-center">
        {t('friends.empty-friends-list.title')}
        {/* You have currently no friends */}
      </div>
      <div className="md:text-xl lg:text-2xl text-slate-800 text-center p-2">
        {t('friends.empty-friends-list.description')}
        {/* You can send invitation to your friends by clicking on "Invitations" */}
      </div>
    </div>
  )
}
