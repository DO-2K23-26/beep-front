import React from 'react'
import { ButtonShadCn, Input } from '@beep/ui'
import { ClipboardCopyIcon } from '@radix-ui/react-icons'

interface IdCodePublicInvitationProps {
  serverId: string | undefined
  copyToClipboard: (text: string, message: string) => void
}

export function IdCodePublicInvitation({
  serverId,
  copyToClipboard
}: IdCodePublicInvitationProps) {
  return (
    <div className="flex gap-4 w-full">
      <Input
        type="code"
        value={serverId}
        className="w-full !text-slate-900"
        readOnly
      />
      <ButtonShadCn
        variant="outline"
        size="icon"
        className="h-10 w-11"
        onClick={() => copyToClipboard(serverId || '', 'Server ID')}
      >
        <ClipboardCopyIcon />
      </ButtonShadCn>
    </div>
  )
}
