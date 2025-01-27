import { ButtonIcon } from '@beep/ui'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { EditRoleContext } from '../feature/edit-role-provider'
import { AssignMemberDialog } from './assign-member-dialog'
import { MemberRow } from './member-row'
import { UnassignMemberDialog } from './unassign-member-dialog'

export function MemberRoleManagement() {
  const { t } = useTranslation()
  const { roleMembers } = useContext(EditRoleContext)
  return (
    <div className="flex flex-col w-full gap-4">
      <div className="sticky top-0">
        <AssignMemberDialog>
          <ButtonIcon
            className="bg-violet-400 sticky top-0"
            title={t('role-settings.assign-members')}
            buttonProps={{ variant: 'ghost' }}
            icon="lucide:user-plus"
          />
        </AssignMemberDialog>
      </div>
      <div>
        {roleMembers &&
          roleMembers.map((member) => (
            <MemberRow member={member} className="snap-end" key={member.id}>
              <UnassignMemberDialog member={member}>
                <ButtonIcon
                  className="bg-transparent"
                  buttonProps={{ variant: 'ghost' }}
                  iconClassName="size-6"
                  icon="lucide:circle-x"
                />
              </UnassignMemberDialog>
            </MemberRow>
          ))}
      </div>
    </div>
  )
}
