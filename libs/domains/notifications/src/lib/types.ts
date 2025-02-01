export enum NOTIFICATION_TYPE {
  USER_MENTIONED_IN_MESSAGE,
  FRIEND_REQUEST,
  FRIEND_MESSAGE
}

export interface FriendRequestNotification {
  senderName: string
}

export interface FriendMessageNotification {
  senderName: string
  channelId: string
}

export interface UserMentionedInMessageNotification {
  serverName: string
  channelName: string
  senderName: string
}

export interface Notification {
  type: NOTIFICATION_TYPE,
  payload: FriendRequestNotification | UserMentionedInMessageNotification | FriendMessageNotification
}
