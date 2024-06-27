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

export default function InviteMemberModalFeature() {
  const dispatch = useDispatch<AppDispatch>()
  const url = window.location.origin.replace(useLocation().pathname, '')
  const [createInvitation] = useCreateInvitationMutation()
  const { server } = useSelector(getServersState)

  const onGenerateCode = async (uniqueCode: boolean, expirationDate: Date) => {
    const response = await createInvitation({
      isUnique: uniqueCode,
      expiration: DateTime.fromJSDate(expirationDate),
      serverId: server?.id || '',
    })
    dispatch(serverActions.setInviteCode(url + '/servers/invite/' + response.data?.id))
    toast.success('Code generated successfully')
  }

  const onGenerateNewCode = () => {
    dispatch(serverActions.setInviteCode(null))
  }

  const copyToClipboard = (copiedText: string, toastText: string) => {
    navigator.clipboard.writeText(copiedText)
    toast.success(toastText + ' copied to clipboard')
  }

  return (
    <InviteMemberModal
      copyToClipboard={copyToClipboard}
      onGenerateCode={onGenerateCode}
      onGenerateNewCode={onGenerateNewCode}
      serverInviteCode={server?.invite_code}
      serverVisibility={server?.visibility}
      serverId={server?.id}
    />
  )
}
