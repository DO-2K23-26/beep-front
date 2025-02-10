import { leftPaneState } from '@beep/responsive'
import { useGetMemberQuery } from '@beep/server'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { UserPopoverFeature } from '@beep/ui'
import {
  getUserState,
  useFetchProfilePictureQuery,
  useGetMeQuery,
} from '@beep/user'
import { cn } from '@beep/utils'
import { skipToken } from '@reduxjs/toolkit/query'
import { DateTime } from 'luxon'
import { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { MessageContext } from '../feature/message-feature'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ServerContext } from '@beep/pages/channels'
import { Permissions } from '@beep/contracts'
/**
 * Component to display a message user information.
 *
 * - If the message is sent by the local client, it uses the information from `useGetMeQuery` while the message is being created.
 * - If the message is in a server, it displays the member's nickname and the member's profile picture.
 * - If the message is in a private channel, it displays the username of the user.
 *
 */
export function MessageUserDisplay() {
  const { myMember } = useContext(ServerContext)
  const { message } = useContext(MessageContext)
  const { payload } = useSelector(getUserState)
  const leftDivState = useSelector(leftPaneState)

  const { t } = useTranslation()
  const { server } = useContext(ServerContext)
  const { data: userMe } = useGetMeQuery()
  const { data: member } = useGetMemberQuery(
    { serverId: server?.id ?? '', userId: message.ownerId },
    { skip: server?.id === undefined }
  )
  const userDisplayedUsername = member?.nickname ?? message.owner?.username
  const userDisplayedId = member?.userId ?? message.owner?.id
  const skipProfilePicture =
    message.owner?.profilePicture === 'default_profile_picture.png' ||
    message.owner?.profilePicture === undefined

  const { currentData: userProfilePicture } = useFetchProfilePictureQuery(
    (message.request ? userMe?.id : userDisplayedId) ?? skipToken,
    {
      skip: skipProfilePicture,
    }
  )

  const formatDate = (dateString: string): string => {
    const date = DateTime.fromISO(dateString)
    const now = DateTime.now()

    if (
      date.hasSame(now, 'day') &&
      date.hasSame(now, 'year') &&
      date.hasSame(now, 'month')
    ) {
      return `${t('channels.message.today')} ${date.toFormat('HH:mm')}`
    } else {
      return date.toFormat('dd/MM/yyyy HH:mm')
    }
  }
  const isNicknameEditable = useMemo(() => {
    if (myMember?.hasOnePermissions([Permissions.MANAGE_NICKNAMES])) {
      return true
    } else if (payload?.sub === member?.userId && myMember) {
      return myMember.hasOnePermissions([Permissions.CHANGE_NICKNAME])
    }
    return false
  }, [myMember, payload?.sub, member?.userId])
  return (
    <div className="flex flex-col sm:flex-row gap-0 sm:gap-4 sm:items-center items-start">
      <div className="flex flex-row gap-3 items-center overflow-hidden">
        <UserPopoverFeature
          userId={message.ownerId}
          serverId={server?.id}
          isNicknameEditable={isNicknameEditable}
        >
          <img
            className={cn(
              'block w-9 h-9 object-cover bg-violet-50 rounded-xl',
              { 'hidden sm:block': leftDivState }
            )}
            src={userProfilePicture ?? '/picture.svg'}
            alt={userDisplayedUsername}
          />
        </UserPopoverFeature>
        <div className="sm:flex gap-3 sm:flex-row">
          <UserPopoverFeature
            userId={message.ownerId}
            serverId={server?.id}
            isNicknameEditable={isNicknameEditable}
          >
            <p
              className={cn(
                'font-semibold text-xs max-w-20 sm:max-w-30 md:max-w-40 lg:max-w-60 hover:underline truncate'
              )}
            >
              {message.request ? userMe?.username : userDisplayedUsername}
            </p>
          </UserPopoverFeature>
          <p className={cn('font-normal text-[10px] sm:text-xs truncate')}>
            {formatDate(message.createdAt ?? '')}
          </p>
        </div>
      </div>
    </div>
  )
}
