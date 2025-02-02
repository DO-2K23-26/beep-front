/* eslint-disable @nx/enforce-module-boundaries */
import { RootState } from '@beep/store'
import { createListenerMiddleware } from '@reduxjs/toolkit'
import { userApi } from './user.api'
import { toggleIsCamera, toggleIsScreenShared, toggleIsVoiceMuted } from './user.slice'

const toggleListenerMiddleware = createListenerMiddleware()

toggleListenerMiddleware.startListening({
  actionCreator: toggleIsScreenShared,
  effect: async (action, listenerApi) => {
    const newValue = listenerApi.getState() as RootState
    const serverId = action.payload
    try {
      await listenerApi
        .dispatch(
          userApi.endpoints.updateState.initiate({
            serverId,
            payload: {
              screenSharing: newValue.user.isScreenShared,
              voiceMuted: newValue.user.isVoiceMuted,
              camera: newValue.user.isCamera,
            },
          })
        )
    } catch (error) {
      //TODO: handle error
    }
  },
})

toggleListenerMiddleware.startListening({
  actionCreator: toggleIsVoiceMuted,
  effect: async (action, listenerApi) => {
    const newValue = listenerApi.getState() as RootState;
    const serverId = action.payload
    try {
      await listenerApi
        .dispatch(
          userApi.endpoints.updateState.initiate({
            serverId,
            payload: {
              screenSharing: newValue.user.isScreenShared,
              voiceMuted: newValue.user.isVoiceMuted,
              camera: newValue.user.isCamera,
            },
          })
        )
    } catch (error) { /* empty */ }
  },
})

toggleListenerMiddleware.startListening({
  actionCreator: toggleIsCamera,
  effect: async (action, listenerApi) => {
    const newValue = listenerApi.getState() as RootState;
    const serverId = action.payload
    try {
      await listenerApi
        .dispatch(
          userApi.endpoints.updateState.initiate({
            serverId,
            payload: {
              screenSharing: newValue.user.isScreenShared,
              voiceMuted: newValue.user.isVoiceMuted,
              camera: newValue.user.isCamera,
            },
          })
        )
    } catch (error) {
      //TODO: handle error
    }
  },
})

export { toggleListenerMiddleware }
