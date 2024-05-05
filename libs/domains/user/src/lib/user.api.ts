import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { RootState } from '@beep/store'
import { backendUrl, LoginRequest, LoginResponse, RefreshRequest, RefreshResponse, RegisterRequest, RegisterResponse, UserEntity } from '@beep/contracts'

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
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (data) => ({
        url: '/authentication/signup',
        method: 'POST',
        body: data
      })
    }),
    refresh: builder.mutation<RefreshResponse, RefreshRequest>({
      query: (refreshToken) => ({
        url: '/authentication/refresh',
        method: 'POST',
        body: refreshToken
      })
    }),
    fetchAllUsers: builder.query<UserEntity[], void>({
      query: () => '/users',
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
  useSendEmailMutation,
  useVerifyEmailMutation,
} = userApi;
