import { ButtonIcon } from '@beep/ui'
import { AssignMemberDialog } from './assign-member-dialog'
import { useTranslation } from 'react-i18next'

export function MemberRoleManagement() {
  const { t } = useTranslation()
  return (
    <div>
      <AssignMemberDialog>
        <ButtonIcon
          className="bg-violet-400"
          title={t('role-settings.assign-members')}
          buttonProps={{ variant: 'ghost' }}
          icon="lucide:user-plus"
        />
      </AssignMemberDialog>
    </div>
  )
}
