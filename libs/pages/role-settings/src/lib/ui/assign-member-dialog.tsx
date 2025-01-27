import { MemberEntity } from '@beep/contracts'
import {
  ButtonIcon,
  Checkbox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@beep/ui'
import {
  PropsWithChildren,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { EditRoleContext } from '../feature/edit-role-provider'
import {
  AssignAction,
  memberInitialState,
  reducer,
} from './assign-member-reducer'
import { MemberRow } from './member-row'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AssignMemberDialogProps {}

export function AssignMemberDialog({
  children,
}: PropsWithChildren<AssignMemberDialogProps>) {
  const {
    serverMembers,
    isLoadingAssignMembers,
    assignMembers,
    isFinishAssignMembers,
  } = useContext(EditRoleContext)
  const [state, dispatch] = useReducer(reducer, memberInitialState)
  const [open, setOpen] = useState(false)

  const toggleMember = (member: MemberEntity) => {
    state.members.some((m) => m.id === member.id)
      ? dispatch({ type: AssignAction.REMOVE, member })
      : dispatch({ type: AssignAction.ADD, member })
  }
  useEffect(() => {
    if (isFinishAssignMembers) setOpen(false)
  }, [isFinishAssignMembers])


  const { t } = useTranslation()
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="flex flex-col bg-violet-50 h-4/5 justify-between">
        <DialogHeader>{t('role-settings.assign-members')}</DialogHeader>
        <div className="h-full overflow-scroll snap-y">
          {serverMembers &&
            serverMembers.map((member) => (
              <MemberRow
                key={member.id}
                member={member}
                onClick={() => toggleMember(member)}
                className="snap-end"
              >
                <Checkbox
                  className="border-black"
                  checked={state.members.some((m) => m.id === member.id)}
                />
              </MemberRow>
            ))}
        </div>

        <DialogFooter className="h-fit">
          <DialogClose>
            <ButtonIcon
              title={t('cancel')}
              className="bg-transparent"
              textClassName="hover:underline"
              buttonProps={{ variant: 'ghost' }}
            />
          </DialogClose>
          <ButtonIcon
            title={t('add')}
            buttonProps={{ variant: 'ghost' }}
            loading={isLoadingAssignMembers}
            onClick={() => assignMembers && assignMembers(state.members)}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
