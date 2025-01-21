import { UpdatePassword } from '@beep/contracts'
import { useChangePasswordMutation } from '@beep/user'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { ModifyPasswordDialog } from '../components/modify-password-setting'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

export function ModifyPasswordFeature() {
  const { t } = useTranslation()
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
      toast.success(t('settings.modify-password-feature.success'))
      setIsPasswordModalOpen(false)
    }
  }, [result, t])

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
          message: t('settings.modify-password-feature.error-mismatch'),
          type: 'validate',
        })
      } else {
        toast.error(t('settings.modify-password-feature.error'))
        setIsPasswordModalOpen(false)
      }
    }
  }, [result, passwordFormController, t])

  return (
    <div className="flex flex-col pt-6 space-y-1">
      <p className="text-2xl">{t('settings.modify-password-feature.title')}</p>
      <ModifyPasswordDialog
        action={handlePasswordSubmit}
        isModalOpen={isPasswordModalOpen}
        setIsModalOpen={setIsPasswordModalOpen}
        passwordFormController={passwordFormController}
      />
    </div>
  )
}
