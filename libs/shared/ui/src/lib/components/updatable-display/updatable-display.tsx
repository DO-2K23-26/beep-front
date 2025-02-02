import { useState } from 'react'
import { Input } from '../inputs'
import { UpdatableDisplayActionButton } from './updable-display-action-button'

interface UpdatableDisplayProps {
  displayedString: string
  onClickEditButton: () => void
  onClickSaveButton: () => void
  formValue: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChangeField: (...event: any[]) => void
  error: string
  isEditable: boolean
  isLoadingEdit: boolean
}

export function UpdatableDisplay({
  displayedString,
  onClickEditButton,
  onClickSaveButton,
  onChangeField,
  error,
  formValue,
  isEditable,
  isLoadingEdit,
}: Partial<UpdatableDisplayProps>) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="flex flex-row gap-4 items-center w-2/3">
      {isEditing ? (
        <div>
          <Input value={formValue} onChange={onChangeField} />
          <div>{error && error}</div>
        </div>
      ) : (
        <p className="truncate">{displayedString}</p>
      )}
      <UpdatableDisplayActionButton
        hidden={isEditable}
        displayIsEditing={isEditing}
        onClickEditButton={() => {
          setIsEditing(true)
          onClickEditButton && onClickEditButton()
        }}
        onClickSaveButton={() => {
          setIsEditing(false)
          onClickSaveButton && onClickSaveButton()
        }}
        isLoading={isLoadingEdit}
      />
    </div>
  )
}
