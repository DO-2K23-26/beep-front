import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { RootState } from '@beep/store'
import { backendUrl, LoginRequest, LoginResponse, RefreshRequest, RefreshResponse, RegisterResponse, UserConnectedEntity } from '@beep/contracts'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: backendUrl,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const { user } = getState() as RootState;
      if (user?.tokens?.accessToken) {
        headers.set('Authorization', `Bearer ${user.tokens.accessToken}`);
      }
      return headers;
    }
  }),
  tagTypes: ['users'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/authentication/signin',
        method: 'POST',
        body: credentials
      })
    }),
    register: builder.mutation<RegisterResponse, FormData>({
      query: (data) => ({
        url: '/authentication/signup',
        method: 'POST',
        body: data,
        formData: true
      })
    }),
    fetchProfilePicture: builder.query<string, string>({
      query: (id) => ({
        url: `/storage/files/secure/profilePicture/${id}`,
        responseHandler: async (response) => {
          const blob = await response.blob();
          return URL.createObjectURL(blob);
        }
      })
    }),
    refresh: builder.mutation<RefreshResponse, RefreshRequest>({
      query: (refreshToken) => ({
        url: '/authentication/refresh',
        method: 'POST',
        body: refreshToken
      })
    }),
    fetchAllUsers: builder.query<UserConnectedEntity[], void>({
      query: () => '/users/display',
      providesTags: ['users']
    }),
    fetchAllUsersConnected: builder.query<UserConnectedEntity[], void>({
      query: () => '/users/onlines',
      providesTags: ['users']
    }),
    sendEmail: builder.mutation<any, void>({
      query: () => ({
        url: '/authentication/send-email',
        method: 'POST'
      })
    }),
    verifyEmail: builder.mutation<any, { token: string }>({
      query: (data) => ({
        url: '/authentication/verify',
        method: 'POST',
        body: data
      })
    })
  })
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshMutation,
  useFetchAllUsersQuery,
  useFetchProfilePictureQuery,
  useFetchAllUsersConnectedQuery,
  useSendEmailMutation,
  useVerifyEmailMutation,
} = userApi;
