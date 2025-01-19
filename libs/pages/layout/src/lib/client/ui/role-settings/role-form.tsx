import { PermissionEntity } from '@beep/contracts'
import { Button, ButtonStyle, InputText } from '@beep/ui'
import { Controller, UseFormReturn } from 'react-hook-form'

export interface RoleFormProps {
  closeModal: () => void
  onCreateRole: () => void
  methodsAddRole: UseFormReturn<{
    name: string
    permissions: string[]
  }>
}

export function RoleForm({
  closeModal,
  onCreateRole,
  methodsAddRole,
}: RoleFormProps) {
  const allRoles: PermissionEntity[] = [
    {
      id: 'ADMINISTRATOR',
      name: 'Administrateur',
      value: 0x1,
      description:
        "Le rôle d'administrateur permet de gérer le serveur de A à Z",
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
      description:
        "Permet d'envoyer des messages dans les salons de discussion",
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

  return (
    <div className="p-6">
      <h3 className="text-slate-700 font-bold mb-2 max-w-sm">Créer un rôle</h3>
      <div className="text-slate-500 text-sm mb-4">
        Choisissez un nom pour le rôle
      </div>
      <Controller
        name="name"
        rules={{
          required: 'Le nom du rôle est requis',
          minLength: {
            value: 1,
            message: 'Le nom du rôle est requis',
          },
        }}
        control={methodsAddRole.control}
        render={({ field, fieldState: { error } }) => (
          <InputText
            className="w-full !rounded-lg min-h-[40px] mb-4"
            label={'Nom du rôle'}
            name="name"
            type="text"
            onChange={field.onChange}
            value={field.value}
            error={error?.message}
          />
        )}
      />
      <div className="mb-4 flex flex-col gap-2">
        {allRoles.map((role, index) => (
          <div
            key={index}
            className="flex flex-row items-center gap-3 px-2 py-[6px] rounded-md cursor-pointer hover:bg-black/10"
          >
            <input
              id={role.name}
              type="checkbox"
              value={role.value}
              {...methodsAddRole.register('permissions')}
            />
            <label htmlFor={role.name} className="cursor-pointer">
              <p className="font-semibold">{role.name}</p>
              <p className="text-slate-500 text-sm">{role.description}</p>
            </label>
          </div>
        ))}
      </div>
      <div className="flex gap-3 justify-between">
        <Button
          className="btn--no-min-w"
          style={ButtonStyle.STROKED}
          onClick={() => closeModal()}
        >
          Annuler
        </Button>
        <Button
          className="btn--no-min-w"
          style={ButtonStyle.BASIC}
          onClick={() => onCreateRole()}
        >
          Créer
        </Button>
      </div>
    </div>
  )
}
