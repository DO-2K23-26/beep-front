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
import {
  useGetMembersQuery,
  useUpdateMemberNicknameMutation,
} from '@beep/server'
import {
  getUserState,
  useFetchProfilePictureQuery,
  useGetUserByIdQuery,
} from '@beep/user'
import { skipToken } from '@reduxjs/toolkit/query'
import { createContext, PropsWithChildren, useEffect } from 'react'
import { Control, FieldValues, useForm, UseFormReset } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { z } from 'zod'

interface UserPopoverProps {
  userId?: string
  serverId?: string
}

interface IUserPopoverContext<NicknameFormType extends FieldValues> {
  goToPrivateConv?: () => void
  askFriend?: () => void
  submitUpdateNickname?: () => void
  resetNicknameForm?: UseFormReset<NicknameFormType>
  nicknameFormControl?: Control<NicknameFormType>
  displayedUser?: UserDisplayedEntity
  myUser?: UserStatePayload
  invitation?: InvitationEntity
  friend?: UserDisplayedEntity
  privateChannel?: ChannelEntity
  member?: MemberEntity
  profilePicture?: string
  isSuccessAskFriend?: boolean
  isFailedAskFriend?: boolean
  isFailedUpdateNickname?: boolean
  isLoadingUpdateNickname?: boolean
}

const nicknameFormSchema = z.object({
  nickname: z.string().min(1, {
    message: "Nickname can't be empty",
  }),
})

export const UserPopoverContext = createContext<
  IUserPopoverContext<z.infer<typeof nicknameFormSchema>>
>({})

export function UserPopoverProvider({
  children,
  userId,
  serverId,
}: PropsWithChildren<UserPopoverProps>) {
  const navigate = useNavigate()
  const { data: user } = useGetUserByIdQuery(
    { id: userId ?? '' },
    { skip: userId === undefined }
  )

  const { member } = useGetMembersQuery(serverId ?? skipToken, {
    skip: serverId === undefined || userId === undefined,
    selectFromResult(state) {
      return { member: state?.data?.find((m) => m.userId === userId) }
    },
  })

  const editRoleForm = useForm<z.infer<typeof nicknameFormSchema>>({
    defaultValues: { nickname: member?.nickname ?? '' },
  })

  const [
    createInvitation,
    { isSuccess: isSuccessAskFriend, isError: isFailedAskFriend },
  ] = useCreateFriendsInvitationByIdMutation()
  const [
    updateMemberNicknameReq,
    {
      isError: isFailedUpdateNickname,
      isSuccess: isSuccessUpdateNickname,
      data: updateMemberNicknameData,
      isLoading: isLoadingUpdateNickname,
      reset: resetNicknameReq,
    },
  ] = useUpdateMemberNicknameMutation()
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

  const submitUpdateNickname = editRoleForm.handleSubmit((data) => {
    updateMemberNicknameReq({
      serverId: serverId ?? '',
      memberId: member?.id ?? '',
      nickname: data.nickname,
    })
  })

  useEffect(() => {
    if (isSuccessUpdateNickname && updateMemberNicknameData) {
      editRoleForm.reset({ nickname: updateMemberNicknameData.nickname })
      resetNicknameReq()
    }
  }, [
    editRoleForm,
    isSuccessUpdateNickname,
    resetNicknameReq,
    updateMemberNicknameData,
  ])
  return (
    <UserPopoverContext.Provider
      value={{
        goToPrivateConv,
        askFriend,
        submitUpdateNickname,
        nicknameFormControl: editRoleForm.control,
        displayedUser: user,
        myUser,
        invitation,
        friend,
        privateChannel,
        member,
        profilePicture,
        isSuccessAskFriend,
        isFailedAskFriend,
        isFailedUpdateNickname,
        isLoadingUpdateNickname,
      }}
    >
      {children}
    </UserPopoverContext.Provider>
  )
}
