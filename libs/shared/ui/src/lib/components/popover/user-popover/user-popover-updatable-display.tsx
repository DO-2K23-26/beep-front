import { useContext } from 'react'
import { UpdatableDisplay } from '../../updatable-display/updatable-display'
import { UserPopoverContext } from './user-popover-provider'
import { Controller } from 'react-hook-form'

export function UserPopoverUpdatableDisplay() {
  const {
    member,
    nicknameFormControl,
    submitUpdateNickname,
    isLoadingUpdateNickname,
  } = useContext(UserPopoverContext)
  return (
    <Controller
      name="nickname"
      control={nicknameFormControl}
      render={({ field, fieldState }) => {
        return (
          <UpdatableDisplay
            isLoadingEdit={isLoadingUpdateNickname}
            onClickSaveButton={submitUpdateNickname}
            displayedString={member?.nickname}
            formValue={field.value}
            onChangeField={field.onChange}
            error={fieldState.error?.message}
          />
        )
      }}
    />
  )
}
