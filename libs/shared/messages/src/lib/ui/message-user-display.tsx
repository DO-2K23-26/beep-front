import { leftPaneState } from '@beep/responsive'
import { useGetMemberQuery } from '@beep/server'
import { useFetchProfilePictureQuery, useGetMeQuery } from '@beep/user'
import { cn } from '@beep/utils'
import { skipToken } from '@reduxjs/toolkit/query'
import { DateTime } from 'luxon'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { MessageContext } from '../feature/message-feature'
import { UserPopover } from '@beep/ui'

/**
 * Component to display a message user information.
 *
 * - If the message is sent by the local client, it uses the information from `useGetMeQuery` while the message is being created.
 * - If the message is in a server, it displays the member's nickname and the member's profile picture.
 * - If the message is in a private channel, it displays the username of the user.
 *
 */
export function MessageUserDisplay() {
  const { message } = useContext(MessageContext)
  const leftDivState = useSelector(leftPaneState)

  const { t } = useTranslation()
  const { serverId } = useParams<{ serverId: string }>()
  const { data: userMe } = useGetMeQuery()
  const { data: member } = useGetMemberQuery(
    { serverId: serverId ?? '', userId: message.ownerId },
    { skip: serverId === undefined }
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
  return (
    <div className="flex flex-col sm:flex-row gap-0 sm:gap-4 sm:items-center items-start">
      <div className="flex flex-row gap-3 items-center overflow-hidden">
        <img
          className={cn(
            'block w-9 min-w-[36px] h-9 min-h-[36px] object-cover bg-violet-50 rounded-xl',
            { 'hidden sm:block': leftDivState }
          )}
          src={userProfilePicture ?? '/picture.svg'}
          alt={userDisplayedUsername}
        />
        <div className="sm:flex gap-3 sm:flex-row">
          <UserPopover userId={message.ownerId}>
            <p
              className={cn(
                'font-semibold text-xs max-w-20 sm:max-w-30 md:max-w-40 lg:max-w-60 hover:underline truncate'
              )}
            >
              {message.request ? userMe?.username : userDisplayedUsername}
            </p>
          </UserPopover>
          <p className={cn('font-normal text-[10px] sm:text-xs truncate')}>
            {formatDate(message.createdAt ?? '')}
          </p>
        </div>
      </div>
    </div>
  )
}
