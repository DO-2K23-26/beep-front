import { useDispatch, useSelector } from 'react-redux'
import { InviteMemberModal } from '../ui/invite-member-modal'
import { AppDispatch } from '@beep/store'
import {
  getServersState,
  serverActions,
  useCreateInvitationMutation,
} from '@beep/server'
import toast from 'react-hot-toast'
import { DateTime } from 'luxon'
import { useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'

export default function InviteMemberModalFeature() {
  const { t } = useTranslation()

  const dispatch = useDispatch<AppDispatch>()
  const url = window.location.origin.replace(useLocation().pathname, '')
  const [createInvitation] = useCreateInvitationMutation()
  const { server, inviteCode } = useSelector(getServersState)

  const onGenerateCode = async (uniqueCode: boolean, expirationDate: Date) => {
    const response = await createInvitation({
      isUnique: uniqueCode,
      expiration: DateTime.fromJSDate(expirationDate),
      serverId: server?.id || '',
    })
    dispatch(
      serverActions.setInviteCode(url + '/servers/invite/' + response.data?.id)
    )
    toast.success(t('layout.invite-member-modal.invite_code_generated'))
  }

  const onGenerateNewCode = () => {
    dispatch(serverActions.setInviteCode(null))
  }

  const copyToClipboard = (copiedText: string, toastText: string) => {
    navigator.clipboard.writeText(copiedText)
    toast.success(
      t('layout.invite-member-modal.code_copied', { text: toastText })
    )
  }

  return (
    <InviteMemberModal
      copyToClipboard={copyToClipboard}
      onGenerateCode={onGenerateCode}
      onGenerateNewCode={onGenerateNewCode}
      serverInviteCode={inviteCode || ''}
      serverVisibility={server?.visibility}
      serverId={server?.id}
    />
  )
}
