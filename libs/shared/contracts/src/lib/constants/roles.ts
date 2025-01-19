import { PermissionEntity } from '../entities'

export const serverRoles: PermissionEntity[] = [
  {
    id: 'ADMINISTRATOR',
    name: { fr: 'Administrateur', en: 'Administrator' },
    value: 0x1,
    description: {
      fr: "Le rôle d'administrateur permet de gérer le serveur de A à Z",
      en: 'The administrator role allows you to manage the server from A to Z',
    },
  },
  {
    id: 'MANAGE_SERVER',
    name: { fr: 'Gérer le server', en: 'Manage server' },
    value: 0x2,
    description: {
      fr: 'Permet de créer, modifier et supprimer le serveur',
      en: 'Allows you to create, modify and delete the server',
    },
  },
  {
    id: 'MANAGE_ROLES',
    name: { fr: 'Gérer les rôles', en: 'Manage roles' },
    value: 0x4,
    description: {
      fr: 'Permet de gérer les rôles permet de créer, modifier et supprimer des rôles',
      en: 'Allows you to manage roles allows you to create, modify and delete roles',
    },
  },
  {
    id: 'CREATE_INVITATION',
    name: { fr: 'Créer des invitations', en: 'Create invitations' },
    value: 0x8,
    description: {
      fr: 'Permet de créer des invitations permet de créer des invitations pour le serveur',
      en: 'Allows you to create invitations allows you to create invitations for the server',
    },
  },
  {
    id: 'MANAGE_CHANNELS',
    name: { fr: 'Gérer les salons de discussion', en: 'Manage channels' },
    value: 0x10,
    description: {
      fr: 'Permet de créer, modifier et supprimer des salons de discussion',
      en: 'Allows you to create, modify and delete discussion channels',
    },
  },
  {
    id: 'MANAGE_WEBHOOKS',
    name: { fr: 'Gérer les webhooks', en: 'Manage webhooks' },
    value: 0x20,
    description: {
      fr: 'Permet de créer, modifier et supprimer des webhooks',
      en: 'Allows you to create, modify and delete webhooks',
    },
  },
  {
    id: 'VIEW_CHANNELS',
    name: {
      fr: 'Voir les salons de discussion',
      en: 'View discussion channels',
    },
    value: 0x40,
    description: {
      fr: 'Permet de voir les salons de discussion',
      en: 'Allows you to see the discussion channels',
    },
  },
  {
    id: 'SEND_MESSAGES',
    name: { fr: 'Envoyer des messages', en: 'Send messages' },
    value: 0x80,
    description: {
      fr: "Permet d'envoyer des messages dans les salons de discussion",
      en: 'Allows you to send messages in the discussion channels',
    },
  },
  {
    id: 'MANAGE_NICKNAMES',
    name: { fr: 'Gérer les surnoms', en: 'Manage nicknames' },
    value: 0x100,
    description: {
      fr: 'Permet de gérer les surnoms des membres du serveur',
      en: 'Allows you to manage the nicknames of the server members',
    },
  },
  {
    id: 'CHANGE_NICKNAME',
    name: { fr: 'Changer son surnom', en: 'Change nickname' },
    value: 0x200,
    description: {
      fr: 'Permet de changer son surnom sur le serveur',
      en: 'Allows you to change your nickname on the server',
    },
  },
  {
    id: 'MANAGE_MESSAGES',
    name: { fr: 'Gérer les messages', en: 'Manage messages' },
    value: 0x400,
    description: {
      fr: 'Permet de supprimer les messages des autres membres du serveur',
      en: 'Allows you to delete messages from other server members',
    },
  },
  {
    id: 'ATTACH_FILES',
    name: { fr: 'Envoyer des pièces jointes', en: 'Send attachments' },
    value: 0x800,
    description: {
      fr: "Permet d'envoyer des pièces jointes dans les salons de discussion",
      en: 'Allows you to send attachments in the discussion channels',
    },
  },
]
