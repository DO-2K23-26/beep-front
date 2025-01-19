export enum Permissions {
  ADMINISTRATOR = 0x1, // Can do any action on any subject (channel, webhooks…) in a server.
  MANAGE_SERVER = 0x2, // Can update a server (all CRUD except delete).
  MANAGE_ROLES = 0x4, // Can do all CRUD operations on all roles.
  CREATE_INVITATION = 0x8, // Can create server invites.
  MANAGE_CHANNELS = 0x10, // Can do all CRUD operations on every channel.
  MANAGE_WEBHOOKS = 0x20, // Can do all CRUD operations on every webhook.
  VIEW_CHANNELS = 0x40, // Can see the channel and its contents (messages).
  SEND_MESSAGES = 0x80, // Can send a message on the channel.
  MANAGE_NICKNAMES = 0x100, // Can update other users’ nicknames.
  CHANGE_NICKNAME = 0x200, // Can update your own nickname.
  MANAGE_MESSAGES = 0x400, // Can delete other users’ messages.
  ATTACH_FILES = 0x800, // Can upload images and files.
}
