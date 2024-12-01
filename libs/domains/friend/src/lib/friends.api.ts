import { backendUrl, DeleteFriendRequest, UserDisplayedEntity } from "@beep/contracts";
import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from '@reduxjs/toolkit/query'
const baseQuery = fetchBaseQuery({
  baseUrl: backendUrl,
  credentials: 'include',
})

export const friendsApi = createApi({
  reducerPath: 'friendsApi',
  baseQuery,
  tagTypes: ['friends'],
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
  }),
})


export const { useDeleteFriendMutation, useGetMyFriendsQuery } = friendsApi
