/* eslint-disable @nx/enforce-module-boundaries */
import { channelApi, channelsReducer } from '@beep/channel'
import { responsiveReducer } from '@beep/responsive'
import { userApi, userReducer } from '@beep/user'
import { voiceSliceReducer } from '@beep/voice'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { serverApi, serverReducer } from '@beep/server'

export const rootReducer = combineReducers({
  user: userReducer,
  channels: channelsReducer,
  responsive: responsiveReducer,
  voice: voiceSliceReducer,
  servers: serverReducer,
  [userApi.reducerPath]: userApi.reducer,
  [channelApi.reducerPath]: channelApi.reducer,
  [serverApi.reducerPath]: serverApi.reducer,
})

export function setupStore(preloadedState?: never) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      })
        .concat(userApi.middleware)
        .concat(channelApi.middleware)
        .concat(serverApi.middleware)
  })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
