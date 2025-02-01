import {
  ChannelEntity,
  InvitationEntity,
  MemberEntity,
  UserDisplayedEntity,
  UserStatePayload,
} from '@beep/contracts'
import {
  useCreateFriendsInvitationByIdMutation,
  useGetMyFriendInvitationsQuery,
  useGetMyFriendsQuery,
  useGetPrivateChannelsQuery,
} from '@beep/friend'
import { useGetMembersQuery } from '@beep/server'
import {
  getUserState,
  useFetchProfilePictureQuery,
  useGetUserByIdQuery,
} from '@beep/user'
import { skipToken } from '@reduxjs/toolkit/query'
import { createContext, PropsWithChildren } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

interface UserPopoverProps {
  userId?: string
  serverId?: string
  className?: string
}

interface IUserPopoverContext {
  goToPrivateConv?: () => void
  askFriend?: () => void
  displayedUser?: UserDisplayedEntity
  myUser?: UserStatePayload
  invitation?: InvitationEntity
  friend?: UserDisplayedEntity
  privateChannel?: ChannelEntity
  member?: MemberEntity
  profilePicture?: string
  isSuccessAskFriend?: boolean
  isFailedAskFriend?: boolean
}

export const UserPopoverContext = createContext<IUserPopoverContext>({})

export function UserPopoverProvider({
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

  const [
    createInvitation,
    { isSuccess: isSuccessAskFriend, isError: isFailedAskFriend },
  ] = useCreateFriendsInvitationByIdMutation()

  const { invitation } = useGetMyFriendInvitationsQuery(undefined, {
    skip: userId === undefined,
    selectFromResult(state) {
      return {
        invitation: state?.data?.find((i) => i.targetId === userId),
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

  const { payload: myUser } = useSelector(getUserState)
  const { member } = useGetMembersQuery(serverId ?? skipToken, {
    skip: serverId === undefined || userId === undefined,
    selectFromResult(state) {
      return { member: state?.data?.find((m) => m.id === userId) }
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

  const goToPrivateConv = () => {
    if (privateChannel) navigate(`/friends/${privateChannel.id}`)
    else navigate(`/friends`)
  }

  const askFriend = () => {
    createInvitation({
      targetId: userId ?? '',
    })
  }

  return (
    <UserPopoverContext.Provider
      value={{
        goToPrivateConv,
        askFriend,
        displayedUser: user,
        myUser,
        invitation,
        friend,
        privateChannel,
        member,
        profilePicture,
        isSuccessAskFriend,
        isFailedAskFriend,
      }}
    >
      {children}
    </UserPopoverContext.Provider>
  )
}
