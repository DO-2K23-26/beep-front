import { UserConnectedEntity } from '@beep/contracts'
import { Button, ButtonStyle, Icon, InputText, UseModalProps } from '@beep/ui'
import { useState } from 'react'
import { ListMembers } from './list-members'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { getResponsiveState } from '@beep/responsive'

interface MembersNavigationProps {
  usersConnected: UserConnectedEntity[]
  users: UserConnectedEntity[]
  onInviteMember: () => void
  openModal: React.Dispatch<React.SetStateAction<UseModalProps | undefined>>
  closeModal: () => void
  inviteCode: string
}

export default function MembersNavigation({
  usersConnected,
  users,
  onInviteMember,
  openModal,
  closeModal,
  inviteCode,
}: MembersNavigationProps) {
  const { showRightPane } = useSelector(getResponsiveState)

  return (
    <div
      className={`bg-violet-300 p-6 rounded-r-3xl flex flex-col gap-6 ${
        showRightPane ? 'w-full' : 'sm:w-fit'
      }`}
    >
      <div className="flex flex-row justify-between items-center gap-10">
        <h5 className="text-slate-900 font-semibold pl-3">Members</h5>
        {/* Invite button */}
        <Button
          iconLeft="lucide:plus"
          className="!bg-violet-400 !min-w-0 px-2 xl:px-3 py-2 text-base rounded-xl hover:rounded-2xl transition-rounded font-semibold flex flex-row gap-2 justify-center items-center cursor-pointer"
          onClick={() => {
            openModal({
              content: <InviteMemberModal inviteCode={inviteCode} />,
            })
          }}
        >
          <h5>Invite</h5>
        </Button>
      </div>
      {/* Members list */}
      <div className="flex flex-col gap-1 overflow-y-scroll no-scrollbar scroll-smooth">
        <ListMembers usersConnected={usersConnected}  users={users} />
      </div>
    </div>
  )
}

interface InviteMemberModalProps {
  inviteCode: string
}

function InviteMemberModal({ inviteCode }: InviteMemberModalProps) {
  const [copied, setCopied] = useState<boolean>(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  return (
    <div className="p-6">
      <h3 className=" text-slate-700 font-bold mb-2 max-w-sm">
        Invite your friends
      </h3>
      <div className="text-slate-500 text-sm mb-4">
        Share this code to invite your friends to this server
      </div>
      <div className="flex flex-row gap-6">
        <InputText
          className="w-full !rounded-lg min-h-[40px]"
          label={'Invite code'}
          name="code"
          type="text"
          disabled={true}
          value={inviteCode}
        />

        <div>
          <Button
            className="!bg-violet-500"
            style={ButtonStyle.SQUARE}
            onClick={copyToClipboard}
          >
            {copied ? (
              <Icon name="lucide:clipboard-check" />
            ) : (
              <Icon name="lucide:clipboard-copy" className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
