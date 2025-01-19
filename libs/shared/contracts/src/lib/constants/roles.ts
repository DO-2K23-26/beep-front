import { PermissionEntity } from '../entities'

export const serverRoles: PermissionEntity[] = [
  {
    id: 'ADMINISTRATOR',
    name: 'Administrateur',
    value: 0x1,
    description: "Le rôle d'administrateur permet de gérer le serveur de A à Z",
  },
  {
    id: 'MANAGE_SERVER',
    name: 'Gérer le server',
    value: 0x2,
    description: 'Permet de créer, modifier et supprimer le serveur',
  },
  {
    id: 'MANAGE_ROLES',
    name: 'Gérer les rôles',
    value: 0x4,
    description:
      'Permet de gérer les rôles permet de créer, modifier et supprimer des rôles',
  },
  {
    id: 'CREATE_INVITATION',
    name: 'Créer des invitations',
    value: 0x8,
    description:
      'Permet de créer des invitations permet de créer des invitations pour le serveur',
  },
  {
    id: 'MANAGE_CHANNELS',
    name: 'Gérer les salons de discussion',
    value: 0x10,
    description:
      'Permet de créer, modifier et supprimer des salons de discussion',
  },
  {
    id: 'MANAGE_WEBHOOKS',
    name: 'Gérer les webhooks',
    value: 0x20,
    description: 'Permet de créer, modifier et supprimer des webhooks',
  },
  {
    id: 'VIEW_CHANNELS',
    name: 'Voir les salons de discussion',
    value: 0x40,
    description: 'Permet de voir les salons de discussion',
  },
  {
    id: 'SEND_MESSAGES',
    name: 'Envoyer des messages',
    value: 0x80,
    description: "Permet d'envoyer des messages dans les salons de discussion",
  },
  {
    id: 'MANAGE_NICKNAMES',
    name: 'Gérer les surnoms',
    value: 0x100,
    description: 'Permet de gérer les surnoms des membres du serveur',
  },
  {
    id: 'CHANGE_NICKNAME',
    name: 'Changer son surnom',
    value: 0x200,
    description: 'Permet de changer son surnom sur le serveur',
  },
  {
    id: 'MANAGE_MESSAGES',
    name: 'Gérer les messages',
    value: 0x400,
    description:
      'Permet de supprimer les messages des autres membres du serveur',
  },
  {
    id: 'ATTACH_FILES',
    name: 'Envoyer des pièces jointes',
    value: 0x800,
    description:
      "Permet d'envoyer des pièces jointes dans les salons de discussion",
  },
]
