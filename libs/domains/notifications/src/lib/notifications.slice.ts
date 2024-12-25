/* eslint-disable @nx/enforce-module-boundaries */
import { RootState } from '@beep/store'
import { createSlice } from '@reduxjs/toolkit'

export enum NOTIFICATION_TYPE {
  USER_MENTIONED_IN_MESSAGE,
  FRIEND_REQUEST // add message_type
}

export interface FriendRequestNotification {
  senderName: string
}

export interface UserMentionedInMessageNotification {
  serverName: string
  channelName: string
  senderName: string
}

export interface Notification {
  type: NOTIFICATION_TYPE,
  payload: FriendRequestNotification | UserMentionedInMessageNotification
}

interface NotifState {
  notifications: Notification[]
}

export const NOTIFICATION_KEY = 'notifications'

export const notifSlice = createSlice({
  name: NOTIFICATION_KEY,
  initialState: {
    notifications: [],
  } as NotifState,
  reducers: {
    setNotifications(state, { payload }: { payload: Notification[] }) {
      state.notifications = payload
    },
  },
})

export const notifReducer = notifSlice.reducer
export const notifActions = notifSlice.actions
export const { setNotifications } = notifActions

export const getNotifState = (root: RootState) => root[NOTIFICATION_KEY]
