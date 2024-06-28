export interface SettingsUserModalProps {
  closeModal: () => void
  onSaveSettingsParameters: () => void
}

export function SettingsUserModal({
  closeModal,
  onSaveSettingsParameters,
}: SettingsUserModalProps) {
  return (
    <div className="flex flex-row">
      <div className="basis-1/6 bg-violet-300 flex-col h-[100dvh]"></div>
      <div className="basis-5/6 bg-violet-200 flex-col h-[100dvh]"></div>
    </div>
  )
}
