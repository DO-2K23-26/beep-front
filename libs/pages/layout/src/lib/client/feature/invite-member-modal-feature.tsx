import {
  useCreateInvitationMutation,
  useGetMyServersQuery
} from '@beep/server'
import { DateTime } from 'luxon'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { InviteMemberModal } from '../ui/invite-member-modal'

interface InviteMemberModalFeatureProps {
  serverId?: string
}

export default function InviteMemberModalFeature({
  serverId,
}: InviteMemberModalFeatureProps) {
  const { t } = useTranslation()
  const url = window.location.host
  const prefix = window.location.protocol
  const [
    createInvitation,
    { data: createResult, isSuccess: isSuccesCreateInvitation, reset },
  ] = useCreateInvitationMutation()
  const { server } = useGetMyServersQuery(undefined, {
    selectFromResult: ({ data, isError }) => {
      if (!data || isError) {
        return { server: undefined }
      }
      return { server: data.find((s) => s.id === serverId) }
    },
  })
  const onGenerateCode = async (uniqueCode: boolean, expirationDate: Date) => {
    createInvitation({
      isUnique: uniqueCode,
      expiration: DateTime.fromJSDate(expirationDate),
      serverId: serverId || '',
    })
  }

  const onGenerateNewCode = () => {
    reset()
  }

  const copyToClipboard = (copiedText: string, toastText: string) => {
    navigator.clipboard.writeText(copiedText)
    toast.success(
      t('layout.invite-member-modal.code_copied', { text: toastText })
    )
  }

  useEffect(() => {
    if (isSuccesCreateInvitation) {
      toast.success(t('layout.invite-member-modal.invite_code_generated'))
    }
  }, [isSuccesCreateInvitation, t])

  return (
    <InviteMemberModal
      copyToClipboard={copyToClipboard}
      onGenerateCode={onGenerateCode}
      onGenerateNewCode={onGenerateNewCode}
      codeGenerated={isSuccesCreateInvitation}
      serverInviteCode={
        prefix + '//' + url + '/servers/invite/' + createResult?.id || ''
      }
      serverVisibility={server?.visibility}
      serverId={server?.id}
    />
  )
}
