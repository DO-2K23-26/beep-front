import { Permissions } from '@beep/contracts'
import {
  Button,
  ButtonShadCn,
  ButtonStyle,
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  InputText,
} from '@beep/ui'
import { Controller, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { RoleCardSwitch } from './role-card-switch'
import { PropsWithChildren } from 'react'
import { DialogContent } from '@radix-ui/react-dialog'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CreateRoleDialogProps {

}

export function CreateRoleDialog({
  children,
}: PropsWithChildren<CreateRoleDialogProps>) {
  const { t } = useTranslation()
  const permissionsCheckboxElement: JSX.Element[] = []

  for (const permission of Object.values(Permissions).filter(
    (value) => typeof value === 'number'
  )) {
    permissionsCheckboxElement.push(
      <RoleCardSwitch key={permission} permission={permission as Permissions} />
    )
  }
  return (
    <AlertDialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="bg-violet-50">
        <DialogHeader>{t('layout.role-form.update_title')}</DialogHeader>
        {/* <Controller
          name="name"
          rules={{
            required: t('layout.role-form.role_name_is_required'),
            minLength: {
              value: 1,
              message: t('layout.role-form.role_name_is_required'),
            },
          }}
          render={({ field, fieldState: { error }, formState }) => {
            return (
              <InputText
                className="w-full !rounded-lg min-h-[40px] mb-4"
                label={t('layout.role-form.role_name')}
                name="name"
                type="text"
                onChange={field.onChange}
                value={field.value}
                error={error?.message}
              />
            )
          }}
        /> */}
        <div className="mb-4 flex flex-col gap-2">
          {permissionsCheckboxElement}
        </div>
        <DialogFooter>
          <DialogClose>
            <ButtonShadCn variant={'ghost'} className="bg-violet-50">
              {t('layout.role-form.cancel')}
            </ButtonShadCn>
          </DialogClose>
          <ButtonShadCn >
            {t('layout.role-form.update')}{' '}
          </ButtonShadCn>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

