import { ModifyTextSetting } from './modify-text-setting'

interface ModifyUsernameEmailProps {
  username: string
  email: string
  openUsernameModal: () => void
  openEmailModal: () => void
}

export function ModifyUsernameEmail({
  username,
  email,
  openEmailModal,
  openUsernameModal,
}: ModifyUsernameEmailProps) {
  return (
    <div className="flex flex-col gap-4 bg-violet-300 rounded-md p-4">
      <ModifyTextSetting
        title={'Username'}
        value={username}
        onClick={openUsernameModal}
      />
      <ModifyTextSetting
        title={'Email'}
        value={email}
        onClick={openEmailModal}
      />
    </div>
  )
}
