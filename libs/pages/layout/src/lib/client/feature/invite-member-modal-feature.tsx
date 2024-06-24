import { useDispatch, useSelector } from 'react-redux'
import { InviteMemberModal } from '../ui/invite-member-modal'
import { AppDispatch } from '@beep/store'
import { getServersState, serverActions } from '@beep/server'
import { getUserState } from '@beep/user'
import toast from 'react-hot-toast'

export default function InviteMemberModalFeature() {
  const dispatch = useDispatch<AppDispatch>()

  const { payload } = useSelector(getUserState)
  const { server } = useSelector(getServersState)

  const onGenerateCode = (
    uniqueCode: boolean,
    expirationDate: Date | undefined
  ) => {
    // Appeler l'API pour générer le code ici et retourner le code

    const generatedCode = 'code returned from api' // Placeholder pour le code généré

    dispatch(serverActions.setInviteCode(generatedCode))
    toast.success('Code generated successfully')

    // console.log('=== Generate code ===')
    // console.log('Server id: ', server?.id)
    // console.log('User id:', payload?.sub)
    // console.log('Unique code: ', uniqueCode)
    // console.log('Expiration date:', expirationDate)
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
