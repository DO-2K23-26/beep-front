import { useTranslation } from 'react-i18next'
import { ButtonNavigationHeader } from './button-navigation-header'

export function HeaderPageFriends() {
  const { t } = useTranslation()
  const friendsUrl = '/friends/all'
  const invitationsUrl = '/friends/invitations'

  return (
    <div className="flex flex-wrap w-fit first-line p-6 gap-2 sm:gap-4 md:gap-6 ">
      <ButtonNavigationHeader path={friendsUrl}>
        {t('friends.header-page-friend.friend')}
      </ButtonNavigationHeader>
      <ButtonNavigationHeader path={invitationsUrl}>
        {t('friends.header-page-friend.invitation')}
      </ButtonNavigationHeader>
    </div>
  )
}
