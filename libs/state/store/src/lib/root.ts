/* eslint-disable @nx/enforce-module-boundaries */
import { userApi, userReducer } from '@beep/user';
import { channelApi, channelsReducer } from '@beep/channel';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { responsiveReducer } from '@beep/responsive'
import { serverReducer } from '@beep/server'

export const rootReducer = combineReducers({
  user: userReducer,
  channels: channelsReducer,
  responsive: responsiveReducer,
  servers: serverReducer,
  [userApi.reducerPath]: userApi.reducer,
  [channelApi.reducerPath]: channelApi.reducer,
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
  })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
