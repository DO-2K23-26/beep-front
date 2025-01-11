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
