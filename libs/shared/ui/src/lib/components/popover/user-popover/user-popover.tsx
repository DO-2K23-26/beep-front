import { useGetMembersQuery } from '@beep/server'
import { cn } from '@beep/transmit'
import { useFetchProfilePictureQuery, useGetUserByIdQuery } from '@beep/user'
import { skipToken } from '@reduxjs/toolkit/query'
import { PropsWithChildren } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'

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
  const { data: user } = useGetUserByIdQuery(
    { id: userId ?? '' },
    { skip: userId === undefined }
  )
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
  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn('flex flex-row bg-violet-50', className)}
      >
        <img
          src={profilePicture ?? '/picture.svg'}
          alt={user?.username ?? "User's profile picture"}
          className="aspect-square size-16 rounded-lg hover:rounded-xl transition-all object-cover"
        />
        {memberDisplayable ? (
          <div className="flex flex-col ml-2">
            {memberDisplayable?.username}
          </div>
        ) : (
          <div className="flex flex-col ml-2">{user?.username}</div>
        )}
      </PopoverContent>
    </Popover>
  )
}
