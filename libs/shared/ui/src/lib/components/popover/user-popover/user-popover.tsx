import {
  useCreateFriendsInvitationByIdMutation,
  useGetMyFriendInvitationsQuery,
  useGetMyFriendsQuery,
  useGetPrivateChannelsQuery,
} from '@beep/friend'
import { useGetMembersQuery } from '@beep/server'
import { cn } from '@beep/transmit'
import {
  getUserState,
  useFetchProfilePictureQuery,
  useGetUserByIdQuery,
} from '@beep/user'
import { skipToken } from '@reduxjs/toolkit/query'
import { PropsWithChildren } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { ButtonIcon } from '../../button/button-icon'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'
import { TooltipPopover } from './tooltip-popover'

interface UserPopoverProps {
  userId?: string
  serverId?: string
  className?: string
}

export function UserPopover({
  children,
  userId,
  serverId,
  className,
}: PropsWithChildren<UserPopoverProps>) {
  const navigate = useNavigate()
  const { data: user } = useGetUserByIdQuery(
    { id: userId ?? '' },
    { skip: userId === undefined }
  )

  const [createInvitation] = useCreateFriendsInvitationByIdMutation()

  const { invitation } = useGetMyFriendInvitationsQuery(undefined, {
    skip: userId === undefined,
    selectFromResult(state) {
      const invitation = state?.data?.find((i) => i.targetId === userId)
      return {
        invitation: invitation,
        ...state,
      }
    },
  })

  const { friend } = useGetMyFriendsQuery(undefined, {
    skip: userId === undefined,
    selectFromResult(state) {
      const friend = state?.data?.find((f) => f.id === userId)
      return {
        friend: friend,
        ...state,
      }
    },
  })

  const { privateChannel } = useGetPrivateChannelsQuery(undefined, {
    skip: friend === undefined,
    selectFromResult(state) {
      const privateChannel = state?.data?.find((c) => c.users[0].id === userId)
      return {
        privateChannel: privateChannel,
        ...state,
      }
    },
  })

  const { payload } = useSelector(getUserState)
  const { memberDisplayable } = useGetMembersQuery(serverId ?? skipToken, {
    skip: serverId === undefined || userId === undefined,
    selectFromResult(state) {
      if (!state.data) return { memberDisplayable: undefined }
      const member = state.data.find((m) => m.userId === userId)
      return {
        memberDisplayable: {
          id: member?.userId,
          username: member?.nickname,
          profilePicture: '',
        },
      }
    },
  })

  const { data: profilePicture } = useFetchProfilePictureQuery(
    userId ?? skipToken,
    {
      skip:
        user?.profilePicture === undefined ||
        user?.profilePicture === 'default_profile_picture.png',
    }
  )

  const onClickMessage = () => {
    if (privateChannel) navigate(`/friends/${privateChannel.id}`)
    else navigate(`/friends`)
  }

  const onClickFriend = () => {
    createInvitation({
      targetId: userId ?? '',
    })
  }

  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn(
          'flex flex-row bg-violet-50 justify-between items-center',
          className
        )}
      >
        <div className="flex flex-row gap-4">
          <img
            src={profilePicture ?? '/picture.svg'}
            alt={user?.username ?? "User's profile picture"}
            className="aspect-square size-10 sm:size-12 md:size-16 rounded-lg hover:rounded-xl transition-all object-cover"
          />
          {memberDisplayable ? (
            <div className="flex flex-col">{memberDisplayable?.username}</div>
          ) : (
            <div className="flex flex-col">{user?.username}</div>
          )}
        </div>
        {payload?.sub !== userId &&
          (friend === undefined ? (
            <TooltipPopover content="Add friend">
              <ButtonIcon
                buttonProps={{ variant: 'ghost' }}
                icon="lucide:user-plus"
                className="rounded-full w-10 h-10"
                onClick={onClickFriend}
              />
            </TooltipPopover>
          ) : (
            <TooltipPopover content="Private message">
              <ButtonIcon
                buttonProps={{ variant: 'ghost' }}
                icon="lucide:message-circle"
                className="rounded-full w-10 h-10"
                onClick={onClickMessage}
              />
            </TooltipPopover>
          ))}
      </PopoverContent>
    </Popover>
  )
}
