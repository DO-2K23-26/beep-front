import { ServerEntity } from '@beep/contracts'
import { RolesSettingsServer } from '../ui/roles-settings-server'
import { Button, ButtonStyle, InputText, useModal } from '@beep/ui'
import { useGetRolesQuery } from '@beep/server'
import { Controller, FormProvider, useForm } from 'react-hook-form'

interface RolesSettingsServerFeatureProps {
  server: ServerEntity
}

export default function RolesSettingsServerFeature({
  server,
}: Readonly<RolesSettingsServerFeatureProps>) {
  const { data: roles } = useGetRolesQuery(server.id)
  const { openModal, closeModal } = useModal()

  const methodsAddRole = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      permissions: [] as {
        name: string
        value: string
        description: string
      }[],
    },
  })

  const allRoles: {
    name: string
    value: string
    description: string
  }[] = [
    {
      name: 'Administrateur',
      value: '0x1',
      description:
        "Le rôle d'administrateur permet de gérer le serveur de A à Z",
    },
    {
      name: 'Gérer le server',
      value: '0x2',
      description: 'Permet de créer, modifier et supprimer le serveur',
    },
    {
      name: 'Gérer les rôles',
      value: '0x4',
      description:
        'Permet de gérer les rôles permet de créer, modifier et supprimer des rôles',
    },
    {
      name: 'Créer des invitations',
      value: '0x8',
      description:
        'Permet de créer des invitations permet de créer des invitations pour le serveur',
    },
    {
      name: 'Gérer les salons de discussion',
      value: '0x10',
      description:
        'Permet de créer, modifier et supprimer des salons de discussion',
    },
    {
      name: 'Gérer les webhooks',
      value: '0x20',
      description: 'Permet de créer, modifier et supprimer des webhooks',
    },
    {
      name: 'Voir les salons de discussion',
      value: '0x40',
      description: 'Permet de voir les salons de discussion',
    },
    {
      name: 'Envoyer des messages',
      value: '0x80',
      description:
        "Permet d'envoyer des messages dans les salons de discussion",
    },
    {
      name: 'Gérer les surnoms',
      value: '0x100',
      description: 'Permet de gérer les surnoms des membres du serveur',
    },
    {
      name: 'Changer son surnom',
      value: '0x200',
      description: 'Permet de changer son surnom sur le serveur',
    },
    {
      name: 'Gérer les messages',
      value: '0x400',
      description:
        'Permet de supprimer les messages des autres membres du serveur',
    },
    {
      name: 'Envoyer des pièces jointes',
      value: '0x800',
      description:
        "Permet d'envoyer des pièces jointes dans les salons de discussion",
    },
  ]

  const onCreateRole = () => {
    openModal({
      content: (
        <FormProvider {...methodsAddRole}>
          <div className="p-6">
            <h3 className="text-slate-700 font-bold mb-2 max-w-sm">
              Créer un rôle
            </h3>
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
                onClick={() => {
                  alert('Création du rôle')
                }}
              >
                Créer
              </Button>
            </div>
          </div>
        </FormProvider>
      ),
    })
  }
  const onUpdateRole = () => {}
  const onDeleteRole = () => {}

  return (
    <RolesSettingsServer
      server={server}
      roles={roles ?? []}
      onCreateRole={onCreateRole}
      onUpdateRole={onUpdateRole}
      onDeleteRole={onDeleteRole}
    />
  )
}
