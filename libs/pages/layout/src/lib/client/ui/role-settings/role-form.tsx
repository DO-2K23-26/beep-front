import { serverRoles } from '@beep/contracts'
import { Button, ButtonStyle, InputText } from '@beep/ui'
import { Controller, UseFormReturn } from 'react-hook-form'

export interface RoleFormProps {
  formType: 'create' | 'update'
  closeModal: () => void
  onSubmitForm: () => void
  methodsRoleForm: UseFormReturn<{
    name: string
    permissions: string[]
  }>
}

export function RoleForm({
  formType,
  closeModal,
  onSubmitForm,
  methodsRoleForm,
}: RoleFormProps) {
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
        control={methodsRoleForm.control}
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
        {serverRoles.map((role, index) => (
          <div
            key={index}
            className="flex flex-row items-center gap-3 px-2 py-[6px] rounded-md cursor-pointer hover:bg-black/10"
          >
            <input
              id={role.name}
              type="checkbox"
              value={role.value}
              {...methodsRoleForm.register('permissions')}
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
          onClick={() => onSubmitForm()}
        >
          {formType === 'update' ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </div>
  )
}
