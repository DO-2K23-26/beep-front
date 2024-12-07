import { InvitationEntity, InvitationStatus } from '@beep/contracts'
import { InvitationAnswerButtons } from '../ui/invitation-answer-buttons'
import { useAnswerFriendsInvitationMutation } from '@beep/friend'
import { useSelector } from 'react-redux'
import { getUserState } from '@beep/user'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

interface InvitationAnswerButtonsFeatureProps {
  invitation: InvitationEntity
}
export function InvitationAnswerButtonsFeature({
  invitation,
}: InvitationAnswerButtonsFeatureProps) {
  const [answerInvitation, result] = useAnswerFriendsInvitationMutation()
  const { payload } = useSelector(getUserState)
  const onAccept = () => {
    answerInvitation({
      invitationId: invitation.id,
      answer: InvitationStatus.Accepted,
    })
  }
  const onDecline = () => {
    answerInvitation({
      invitationId: invitation.id,
      answer: InvitationStatus.Declined,
    })
  }

  useEffect(() => {
    if (result.isSuccess) {
      toast.success('Invitation answered')
    }
    if (result.isError) {
      toast.error('Invitation answer failed')
    }
  }, [result.isError, result.isSuccess])
  return (
    <InvitationAnswerButtons
      onAccept={onAccept}
      onDecline={onDecline}
      // Only display the accept button if the current user is the target of the invitation
      displayAccept={payload?.sub === invitation.targetId}
    />
  )
}
