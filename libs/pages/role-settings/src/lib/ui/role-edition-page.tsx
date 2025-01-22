import { ButtonShadCn } from '@beep/ui'
import { cn } from '@beep/utils'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { EditRoleContext } from '../feature/edit-role-provider'
import { PermissionEdition } from './permission-edition'
import { MemberRoleManagement } from './member-role-management'

enum EditionPage {
  PermissionEditionPage,
  MemberEditionPage,
}

export function RoleEditionPage() {
  const { t } = useTranslation()
  const { role } = useContext(EditRoleContext)

  const [focusedPage, setFocusedPage] = useState(
    EditionPage.PermissionEditionPage
  )

  const pages = [
    {
      id: EditionPage.PermissionEditionPage,
      name: t('role-settings.role-edition-page.permissions'),
      page: <PermissionEdition />,
    },
    {
      id: EditionPage.MemberEditionPage,
      name: t('role-settings.role-edition-page.members'),
      page: <MemberRoleManagement />,
    },
  ]

  return (
    <div className="flex flex-col gap-4 px-2 w-full h-full pb-16">
      <div className="text-lg sm:text-xl md:text-2xl">{role?.name}</div>
      <div className="flex flex-row gap-2">
        {pages.map((page) => (
          <ButtonShadCn
            key={page.id}
            variant={'ghost'}
            onClick={() => setFocusedPage(page.id)}
            size={'responsiveDefault'}
            className={cn(
              'hover:bg-violet-100 text-xs sm:text-sm md:text-base px-2 py-1',
              {
                'bg-violet-500': focusedPage === page.id,
              }
            )}
          >
            {page.name}
          </ButtonShadCn>
        ))}
      </div>
      <div className="flex w-full h-full overflow-scroll">
        <PermissionEdition />
      </div>
    </div>
  )
}
