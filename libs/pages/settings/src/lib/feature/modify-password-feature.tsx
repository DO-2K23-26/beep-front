import { UpdatePassword } from '@beep/contracts'
import { useChangePasswordMutation } from '@beep/user'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { ModifyPasswordDialog } from '../components/modify-password-setting'
import toast from 'react-hot-toast'

export function ModifyPasswordFeature() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [changePassword, result] = useChangePasswordMutation()

  useEffect(() => {
    if (!result.isSuccess) {
      toast.error(
        'Something went wrong when updating your profile'
      )
    } else {
      toast.success('Update successful')
    }
  }, [result])

  const passwordFormController = useForm({
    mode: 'onChange',
    defaultValues: {
      currentPassword: '',
      verifyNewPassword: '',
      newPassword: ''
    },
  })

  const handlePasswordSubmit = passwordFormController.handleSubmit((data) => {
    const request: UpdatePassword = {
      newPassword: data.newPassword,
      oldPassword: data.currentPassword,
    }
    changePassword(request)
    passwordFormController.reset()
  })

  return (
    <div className='flex flex-col pt-6 space-y-1'>
      <p className='text-2xl'>Password & Authentification</p>
      <ModifyPasswordDialog
        action={handlePasswordSubmit}
        isModalOpen={isPasswordModalOpen}
        setIsModalOpen={setIsPasswordModalOpen}
        passwordFormController={passwordFormController}
      />
    </div>
  )
}
