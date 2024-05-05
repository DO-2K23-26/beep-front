import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { RootState } from '@beep/store';
import { backendUrl, MessageEntity } from '@beep/contracts';

const baseQuery = fetchBaseQuery({
  baseUrl: backendUrl,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const { user } = getState() as RootState;
    headers.set('Authorization', `Bearer ${user.tokens.accessToken}`);
  },
});

export const messageApi = createApi({
  reducerPath: 'messageApi',
  baseQuery,
  tagTypes: ['messages'],
  endpoints: (builder) => ({
    getMessages: builder.query<MessageEntity[], MessageRequest>({
      query: (params) => `/server/${params}/channels`,
      providesTags: ['channels']
    }),
  })
})

export const {
  useGetMessagesQuery,
} = messageApi
