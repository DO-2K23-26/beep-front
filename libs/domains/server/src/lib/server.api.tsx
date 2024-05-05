import { backendUrl, ServerEntity } from '@beep/contracts';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@beep/store';
import { join } from 'path';

const baseQuery = fetchBaseQuery({
    baseUrl: backendUrl,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const { user } = getState() as RootState;
      headers.set('Authorization', `Bearer ${user.tokens.accessToken}`);
    },
});
  
export const serverApi = createApi({
    reducerPath: 'serverApi',
    baseQuery,
    tagTypes: ['servers'],
    endpoints: (builder) => ({
      getServers: builder.query<ServerEntity[], number>({
        query: (params) => `/server`,
        providesTags: ['servers']
      }),
      joinServer: builder.mutation<void, string>({
        query: (serverId) => ({
          url: `/server/${serverId}`,
          method: 'POST',
        }),
        invalidatesTags: ['servers'],
      }),
    })
  })
  
export const {
  useGetServersQuery,
  useJoinServerMutation,
  } = serverApi
  
  