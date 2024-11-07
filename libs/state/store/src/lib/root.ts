/* eslint-disable @nx/enforce-module-boundaries */
import { channelApi, voiceChannelReducer } from '@beep/channel'
import { messageReducer } from '@beep/message'
import { responsiveReducer } from '@beep/responsive'
import { serverApi, serverReducer } from '@beep/server'
import { toggleListenerMiddleware, userApi, userReducer } from '@beep/user'
import { webRTCMiddleware, webrtcSliceReducer } from '@beep/voice'
import { Action, combineReducers, configureStore } from '@reduxjs/toolkit'
import { authApi, authenticationReducer } from '@beep/authentication'

export const appReducer = combineReducers({
  authentication: authenticationReducer,
  user: userReducer,
  channels: voiceChannelReducer,
  responsive: responsiveReducer,
  servers: serverReducer,
  message: messageReducer,
  webRTC: webrtcSliceReducer,
  [userApi.reducerPath]: userApi.reducer,
  [channelApi.reducerPath]: channelApi.reducer,
  [serverApi.reducerPath]: serverApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
})

const rootReducer = (state: RootState | undefined, action: Action) => {
  if (action.type === 'RESET') {
    state = undefined
  }
  return appReducer(state, action)
}

export function setupStore(preloadedState?: never) {
  return configureStore({
    reducer: rootReducer, // Directly assign rootReducer here
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }).concat(
        userApi.middleware,
        channelApi.middleware,
        serverApi.middleware,
        toggleListenerMiddleware.middleware,
        webRTCMiddleware
      ),
  })
}


export const resetStore = () => ({ type: 'RESET' })
export type RootState = ReturnType<typeof appReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
