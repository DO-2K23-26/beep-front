import { CreateFriendInvitationRequest, AnswerInvitationRequest, backendUrl, DeleteFriendRequest, UserDisplayedEntity, InvitationEntity, ChannelEntity } from "@beep/contracts";
import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { createApi } from "@reduxjs/toolkit/query/react";
const baseQuery = fetchBaseQuery({
  baseUrl: backendUrl,
  credentials: 'include',
})

export const friendsApi = createApi({
  reducerPath: 'friendsApi',
  baseQuery,
  tagTypes: ['friends', 'invitations', 'channels'],
  endpoints: (builder) => ({
    deleteFriend: builder.mutation<void, DeleteFriendRequest>({
      query: (request) => ({
        url: `/friends/${request.friendId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['friends'],
    }),
    getMyFriends: builder.query<UserDisplayedEntity[], void>({
      query: () => '/v1/users/@me/friends',
      providesTags: ['friends'],
    }),
    getMyFriendInvitations: builder.query<InvitationEntity[], void>({
      query: () => '/v1/users/@me/invitations',
      providesTags: ['invitations'],
    }),
    createFriendsInvitation: builder.mutation<void, CreateFriendInvitationRequest>({
      query: ({ targetUsername }) => ({
        url: '/invitations',
        method: 'POST',
        body: { targetUsername },
      }),
      invalidatesTags: ['invitations'],
    }),

    answerFriendsInvitation: builder.mutation<void, AnswerInvitationRequest>({
      query: ({ invitationId, answer }) => ({
        url: `/invitations/${invitationId}`,
        method: 'PATCH',
        body: { answer },
      }),
      invalidatesTags: ['friends', 'invitations', 'channels'],
    }),

    getPrivateChannels: builder.query<ChannelEntity[], void>({
      query: () => '/v1/users/@me/channels',
      providesTags: [{type: 'channels' , id: 'private'}],
    }),
  })
})


export const {
  useDeleteFriendMutation,
  useGetMyFriendsQuery,
  useAnswerFriendsInvitationMutation,
  useCreateFriendsInvitationMutation,
  useGetMyFriendInvitationsQuery,
  useGetPrivateChannelsQuery } = friendsApi
