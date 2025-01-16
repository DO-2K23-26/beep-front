import { UpdatePassword } from '@beep/contracts'
import {
  useChangePasswordMutation,
  useUpdateMeMutation,
} from '@beep/user'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { ModifyPasswordDialog } from '../components/modify-password-setting'
import toast from 'react-hot-toast'

export function ModifyPasswordFeature() {
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
    const [updateMe] = useUpdateMeMutation()
    const [changePassword, result] = useChangePasswordMutation()
    useEffect(() => {
      if (result.isSuccess) {
        toast.success('Update successful')
      } else if (result.isError) {
        toast.error('Something went wrong when updating your profile')
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
    setIsPasswordModalOpen(false)
    const formData = new FormData()
    const request:UpdatePassword = {
      newPassword:data.newPassword,
      oldPassword:data.currentPassword,    
    } 
    changePassword(request)
    formData.append('newPassword', data.newPassword)
    formData.append('oldPassword', data.currentPassword)
    updateMe(formData)
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