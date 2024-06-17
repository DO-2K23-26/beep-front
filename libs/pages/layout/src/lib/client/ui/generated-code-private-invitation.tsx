import { ButtonShadCn, Input } from '@beep/ui'
import { ClipboardCopyIcon } from '@radix-ui/react-icons'

interface GeneratedCodePrivateInvitationProps {
  serverInviteCode: string | undefined
  onGenerateNewCode: () => void
  copyToClipboard: (text: string, message: string) => void
}

export function GeneratedCodePrivateInvitation({
  serverInviteCode,
  onGenerateNewCode,
  copyToClipboard
}: GeneratedCodePrivateInvitationProps) {
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex gap-4 w-full">
        <Input
          type="code"
          value={serverInviteCode}
          className="w-full !text-slate-900"
          readOnly
        />
        <ButtonShadCn
          variant="outline"
          size="icon"
          className="h-10 w-11"
          onClick={() => copyToClipboard(serverInviteCode || '', 'Invitation code')}
        >
          <ClipboardCopyIcon />
        </ButtonShadCn>
      </div>
      <ButtonShadCn
        variant="link"
        className="p-0"
        onClick={onGenerateNewCode}
      >
        Create a new code!
      </ButtonShadCn>
    </div>
  )
}