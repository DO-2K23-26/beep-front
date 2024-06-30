/* eslint-disable @nx/enforce-module-boundaries */
import { RootState } from '@beep/store'
import { createListenerMiddleware } from '@reduxjs/toolkit'
import { userApi } from '../lib/user.api'
import { toggleIsMuted, toggleIsVoiceMuted } from './user.slice'

const toggleListenerMiddleware = createListenerMiddleware()

toggleListenerMiddleware.startListening({
  actionCreator: toggleIsMuted,
  effect: async (action, listenerApi) => {
    const newValue = listenerApi.getState() as RootState
    const serverId = action.payload
    try {
      await listenerApi
        .dispatch(
          userApi.endpoints.updateState.initiate({
            serverId,
            payload: {
              muted: newValue.user.isMuted,
              voiceMuted: newValue.user.isVoiceMuted,
            },
          })
        )
    } catch (error) {
      console.error('Failed to update backend:', error)
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
              muted: newValue.user.isMuted,
              voiceMuted: newValue.user.isVoiceMuted,
            },
          })
        )
    } catch (error) {
      console.error('Failed to update backend:', error)
    }
  },
})

export { toggleListenerMiddleware }
