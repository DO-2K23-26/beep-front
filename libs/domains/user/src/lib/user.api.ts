import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  backendUrl,
  ConfirmEmailRequest,
  LoginRequest,
  LoginResponse,
  RefreshRequest,
  RefreshResponse,
  RegisterResponse,
  UpdateUserResponse,
  UserConnectedEntity,
  UserDisplayedEntity,
  UserEntity,
} from '@beep/contracts'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { RootState } from '@beep/store'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: backendUrl,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const { user } = getState() as RootState
      if (user?.tokens?.accessToken) {
        headers.set('Authorization', `Bearer ${user.tokens.accessToken}`)
      }
      return headers
    },
  }),
  tagTypes: ['users', 'profilePicture', 'me'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/authentication/signin',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<RegisterResponse, FormData>({
      query: (data) => ({
        url: '/authentication/signup',
        method: 'POST',
        body: data,
        formData: true,
      }),
    }),
    updateMe: builder.mutation<UpdateUserResponse, FormData>({
      query: (data) => ({
        url: '/users/@me',
        method: 'PUT',
        body: data,
        formData: true,
      }),
      invalidatesTags: ['profilePicture', 'me'],
    }),
    getMe: builder.query<UserEntity, void>({
      query: () => ({
        url: '/users/@me',
        method: 'GET',
      }),
      providesTags: ['me'],
    }),
    fetchProfilePicture: builder.query<string, string>({
      query: (id) => ({
        url: `/storage/files/secure/profilePicture/${id}`,
        responseHandler: async (response) => {
          const blob = await response.blob()
          return URL.createObjectURL(blob)
        },
      }),
      providesTags: ['profilePicture', 'me'],
    }),
    refresh: builder.mutation<RefreshResponse, RefreshRequest>({
      query: (refreshToken) => ({
        url: '/authentication/refresh',
        method: 'POST',
        body: refreshToken,
      }),
    }),
    confirmEmail: builder.mutation<void, ConfirmEmailRequest>({
      query: (data) => ({
        url: `/users/@me/email`,
        method: 'PUT',
        body: data,
      }),
    }),
    fetchAllUsers: builder.query<UserConnectedEntity[], void>({
      query: () => '/users/display',
      providesTags: ['users'],
    }),
    fetchAllUsersConnected: builder.query<UserConnectedEntity[], void>({
      query: () => '/users/onlines',
      providesTags: ['users'],
    }),
    sendEmail: builder.mutation<any, void>({
      query: () => ({
        url: '/authentication/send-email',
        method: 'POST',
      }),
    }),
    verifyEmail: builder.mutation<any, { token: string }>({
      query: (data) => ({
        url: '/authentication/verify',
        method: 'POST',
        body: data,
      }),
    }),
    getUserById: builder.query<UserDisplayedEntity, string>({
      query: (id) => `/users/${id}`,
      providesTags: ['users'],
    }),
  }),
})

export const {
  useConfirmEmailMutation,
  useLoginMutation,
  useRegisterMutation,
  useRefreshMutation,
  useGetMeQuery,
  useFetchAllUsersQuery,
  useUpdateMeMutation,
  useFetchProfilePictureQuery,
  useFetchAllUsersConnectedQuery,
  useSendEmailMutation,
  useVerifyEmailMutation,
  useGetUserByIdQuery,
} = userApi
