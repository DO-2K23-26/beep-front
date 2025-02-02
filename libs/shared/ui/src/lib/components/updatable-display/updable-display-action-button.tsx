import { ButtonIcon } from '../button/button-icon'

interface UpdatableDisplayActionButtonProps {
  hidden?: boolean
  displayIsEditing?: boolean
  isLoading?: boolean
  onClickEditButton?: () => void
  onClickSaveButton?: () => void
}

export function UpdatableDisplayActionButton({
  hidden,
  displayIsEditing,
  isLoading,
  onClickEditButton,
  onClickSaveButton,
}: UpdatableDisplayActionButtonProps) {
  if (hidden) return
  if (isLoading)
    return (
      <ButtonIcon
        disabled
        buttonProps={{ variant: 'ghost' }}
        className="bg-transparent"
        loading={true}
      />
    )

  if (displayIsEditing)
    return (
      <ButtonIcon
        buttonProps={{ variant: 'ghost' }}
        icon="lucide:check"
        className="bg-transparent"
        onClick={onClickSaveButton}
      />
    )
  else
    return (
      <ButtonIcon
        buttonProps={{ variant: 'ghost' }}
        icon="lucide:pencil"
        className="bg-transparent"
        onClick={onClickEditButton}
      />
    )
}
