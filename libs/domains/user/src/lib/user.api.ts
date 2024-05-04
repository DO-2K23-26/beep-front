import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { RootState } from '@beep/store'
import { backendUrl, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@beep/contracts'

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
        url: '/auth/login',
        method: 'POST',
        body: credentials
      })
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (data) => ({
        url: '/user',
        method: 'POST',
        body: data
      })
    }),
    refresh: builder.mutation<any, string>({
      query: (refreshToken) => ({
        url: '/auth/refresh',
        method: 'POST',
        body: { refreshToken }
      })
    })
  })
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshMutation,
} = userApi;
