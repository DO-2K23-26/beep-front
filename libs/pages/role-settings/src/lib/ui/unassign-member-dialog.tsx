import {
  ButtonIcon,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@beep/ui'
import { PropsWithChildren, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { EditRoleContext } from '../feature/edit-role-provider'
import { MemberEntity } from '@beep/contracts'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface UnassignMemberDialogProps {
  member: MemberEntity
}

export function UnassignMemberDialog({
  children,
  member,
}: PropsWithChildren<UnassignMemberDialogProps>) {
  const { t } = useTranslation()
  const { unassignMember, isLoadingUnassignMembers, isFinishUnassignMembers } =
    useContext(EditRoleContext)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (isFinishUnassignMembers) setOpen(false)
  }, [isFinishUnassignMembers])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className='bg-violet-50'>
        <DialogHeader>
          {t('role-settings.unassign-member-dialog.title')}
        </DialogHeader>
        <DialogDescription>
          {t('role-settings.unassign-member-dialog.description')}
        </DialogDescription>
        <DialogFooter>
          <DialogClose>
            <ButtonIcon
              title={t('cancel')}
              className="bg-transparent"
              textClassName="hover:underline"
              buttonProps={{ variant: 'ghost' }}
            />
          </DialogClose>
          <ButtonIcon
            title={t('remove')}
            buttonProps={{ variant: 'ghost' }}
            className="bg-red-500"
            onClick={() => unassignMember && unassignMember(member)}
            loading={isLoadingUnassignMembers}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
