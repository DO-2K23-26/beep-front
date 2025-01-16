import { UpdatePassword } from '@beep/contracts'
import { useChangePasswordMutation } from '@beep/user'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { ModifyPasswordDialog } from '../components/modify-password-setting'
import toast from 'react-hot-toast'

export function ModifyPasswordFeature() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [changePassword, result] = useChangePasswordMutation()

  const passwordFormController = useForm({
    mode: 'onChange',
    defaultValues: {
      currentPassword: '',
      verifyNewPassword: '',
      newPassword: '',
    },
  })

  useEffect(() => {
    if (result.isSuccess) {
      toast.success('Update successful')
      setIsPasswordModalOpen(false)
    }
  }, [result])

  const handlePasswordSubmit = passwordFormController.handleSubmit((data) => {
    const request: UpdatePassword = {
      newPassword: data.newPassword,
      oldPassword: data.currentPassword,
    }
    changePassword(request)
    passwordFormController.reset()
  })

  useEffect(() => {
    if (result.isError && result.error !== undefined) {
      // @ts-expect-error errorCreateServer is not undefined
      const error = result.error.data as HttpError
      if (error.code === 'E_CURRENT_PASSWORD_MISMATCHING') {
        passwordFormController.setError('currentPassword', {
          message: 'The current password is wrong',
          type: 'validate',
        })
      } else {
        toast.error('Something whent wrong, please try again')
        setIsPasswordModalOpen(false)
      }
    }
  }, [result, passwordFormController])

  return (
    <div className="flex flex-col pt-6 space-y-1">
      <p className="text-2xl">Password & Authentification</p>
      <ModifyPasswordDialog
        action={handlePasswordSubmit}
        isModalOpen={isPasswordModalOpen}
        setIsModalOpen={setIsPasswordModalOpen}
        passwordFormController={passwordFormController}
      />
    </div>
  )
}
