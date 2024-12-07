import { InvitationStatus } from "../../enums"

export interface AnswerInvitationRequest {
  invitationId: string
  answer: InvitationStatus
}
