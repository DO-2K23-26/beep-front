import {
  useFetchProfilePictureQuery,
  useGetMeQuery,
  useSendOtpEmailMutation,
  useUpdateEmailMutation,
  useUpdateMeMutation,
  useVerifyOtpCodeMutation,
} from '@beep/user'
import { skipToken } from '@reduxjs/toolkit/query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ModifyEmailDialog } from '../components/modify-email-dialog'
import { ModifyProfileCard } from '../components/modify-profile-card'
import { ModifyProfilePictureDialog } from '../components/modify-profile-picture-dialog'
import { ModifyUsernameDialog } from '../components/modify-username-dialog'
import { ModifyFirstnameDialog } from '../components/modify-firstname-dialog'
import { ModifyLastnameDialog } from '../components/modify-lastname-dialog'
import { ValidateOtpDialog } from '../components/validate-otp-dialog'
import { ValidateEmailDialog } from '../components/validate-email-dialog'

import { useTranslation } from 'react-i18next'

// This is the profile page of the user account, you can find it in the settings
export function ModifyProfileCardFeature() {
  const { t } = useTranslation()

  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isEmailValidateModalOpen, setIsEmailValidateModalOpen] =
    useState(false)
  const [isPictureModalOpen, setIsPictureModalOpen] = useState(false)
  const [isFirstnameModalOpen, setIsFirstnameModalOpen] = useState(false)
  const [isLastnameModalOpen, setIsLastnameModalOpen] = useState(false)
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false)
  const [newProfilePicture, setNewProfilePicture] = useState<string | null>(
    null
  )
  const [errorPictureText, setErrorPictureText] = useState('')
  const [
    sendOtpEmail,
    {
      isLoading: isLoadingOtpEmail,
      isSuccess: isSuccessOtpEmail,
      isError: isErrorOtpEmail,
      error: errorOtpEmail,
    },
  ] = useSendOtpEmailMutation() // Mutation to send OTP to the new email
  const [
    verifyOtpCode,
    {
      isLoading: isLoadingOtpVerify,
      isSuccess: isSuccessOtpVerify,
      isError: isErrorOtpVerify,
      error: errorOtpVerify,
    },
  ] = useVerifyOtpCodeMutation() // Mutation to send OTP to the new email
  const [
    updateMe,
    {
      isLoading: isLoadingUpdateMe,
      isSuccess: isSuccessUpdateMe,
      isError: isErrorUpdateMe,
      error: errorUpdateMe,
    },
  ] = useUpdateMeMutation()
  const [
    updateEmail,
    {
      isLoading: isLoadingUpdateEmail,
      isSuccess: isSuccessUpdateEmail,
      isError: isErrorUpdateEmail,
      error: errorUpdateEmail,
    },
  ] = useUpdateEmailMutation()
  const { data: userMe } = useGetMeQuery()

  const errorPictureNotFilled = t(
    'settings.modify-profile-card.picture_not_filled'
  )
  const emailFormController = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  })
  const updateEmailFormController = useForm({
    mode: 'onChange',
    defaultValues: {
      password: '',
      email: '',
    },
  })
  const otpFormController = useForm({
    mode: 'onChange',
    defaultValues: {
      otp: '',
    },
  })
  const usernameFormController = useForm({
    mode: 'onChange',
    defaultValues: {
      username: '',
    },
  })

  const firstnameFormController = useForm({
    mode: 'onChange',
    defaultValues: {
      firstName: '',
    },
  })

  const lastnameFormController = useForm({
    mode: 'onChange',
    defaultValues: {
      lastName: '',
    },
  })

  const pictureFormController = useForm({
    mode: 'onChange',
    defaultValues: {
      profilePicture: new File([], ''),
    },
  })
  const addProfilePicture = (file: File) => {
    if (file.type.includes('image')) {
      pictureFormController.setValue('profilePicture', file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewProfilePicture(reader.result as string)
        setErrorPictureText('')
      }
      reader.readAsDataURL(file)
    }
  }
  const { currentData: userProfilePicture } = useFetchProfilePictureQuery(
    userMe?.id ?? skipToken
  )

  // submit
  const handleUsernameSubmit = usernameFormController.handleSubmit((data) => {
    setIsPictureModalOpen(false)
    const formData = new FormData()
    formData.append('username', data.username)
    updateMe(formData)
  })
  const handleFirstnameSubmit = firstnameFormController.handleSubmit((data) => {
    const formData = new FormData()
    formData.append('firstName', data.firstName)
    updateMe(formData)
    setIsFirstnameModalOpen(false)
    firstnameFormController.reset()
  })
  const handleLastnameSubmit = lastnameFormController.handleSubmit((data) => {
    const formData = new FormData()
    formData.append('lastName', data.lastName)
    updateMe(formData)
    setIsLastnameModalOpen(false)
    lastnameFormController.reset()
  })

  // update of the email
  const handleEmailUpdate = updateEmailFormController.handleSubmit((data) => {
    const formData = {
      newEmail: data.email,
      oldEmail: userMe?.email || '',
      password: data.password,
    }
    updateEmail(formData)
  })

  // Send email to generate otp code
  const handleEmailSubmit = emailFormController.handleSubmit((data) => {
    const requestData = { email: userMe?.email || '' }
    updateEmailFormController.reset()
    sendOtpEmail(requestData)
    setIsEmailModalOpen(false)
    setIsOtpModalOpen(true)
  })

  // Verify the OTP entered by the user
  const handleOtpSubmit = otpFormController.handleSubmit((data) => {
    const requestData = { email: userMe?.email || '', otp: data.otp }
    verifyOtpCode(requestData)
    otpFormController.reset()
  })

  const handlePictureSubmit = pictureFormController.handleSubmit((data) => {
    if (newProfilePicture && data) {
      setIsPictureModalOpen(false)
      const formData = new FormData()
      formData.append('profilePicture', data.profilePicture)
      updateMe(formData)
    } else setErrorPictureText(errorPictureNotFilled)
    setNewProfilePicture('')
  })

  useEffect(() => {
    if (isErrorUpdateMe && errorUpdateMe !== undefined) {
      // @ts-expect-error errorCreateServer is not undefined
      const error = errorUpdateMe.data as HttpError
      if (error.code === 'E_USERNAMEALREADYEXISTS') {
        usernameFormController.setError('username', {
          message: t(
            'settings.modify-profile-card.error_message_username_already_exist'
          ),
          type: 'validate',
        })
      }
      // else if (error.code === 'E_EMAILALREADYEXISTS') {
      //   updateEmailFormController.setError('email', {
      //     message: t(
      //       'settings.modify-profile-card.error_message_email_already_exist'
      //     ),
      //     type: 'validate',
      //   })
      // }
      else {
        toast.error(
          t('settings.modify-profile-card.error_profile_update')
        )
        setIsUsernameModalOpen(false)
        setIsEmailValidateModalOpen(false)
      }
    }
  }, [
    errorUpdateMe,
    isErrorUpdateMe,
    usernameFormController,
    updateEmailFormController, t
  ])

  useEffect(() => {
    if (isSuccessUpdateMe) {
      toast.success(t('settings.modify-profile-card.success_update_profile'))
      setIsUsernameModalOpen(false)
    }
  }, [isSuccessUpdateMe, t])

  // use effect of the otp email send
  useEffect(() => {
    if (isSuccessOtpEmail) {
      toast.success(t('settings.modify-profile-card.success_email_send'))
    }
    if (isErrorOtpEmail || errorOtpEmail) {
      toast.error(t('settings.modify-profile-card.error_email_send'))
    }
  }, [isSuccessOtpEmail, isErrorOtpEmail, errorOtpEmail, t])

  // use effect of the verification of the otp code
  useEffect(() => {
    if (isSuccessOtpVerify) {
      toast.success(t('settings.modify-profile-card.success_otp_code'))
      setIsEmailValidateModalOpen(true)
      setIsOtpModalOpen(false)
    }
    if (isErrorOtpVerify || errorOtpVerify) {
      toast.error(t('settings.modify-profile-card.error_otp_code'))
    }
  }, [isSuccessOtpVerify, isErrorOtpVerify, errorOtpVerify, otpFormController, t])

  // use effect when we update the email
  useEffect(() => {
    if (errorUpdateEmail && isErrorUpdateEmail !== undefined) {
      // @ts-expect-error errorCreateServer is not undefined
      const error = errorUpdateEmail.data as HttpError
      if (error.code === 'E_EMAILALREADYEXISTS') {
        updateEmailFormController.setError('email', {
          message: t(
            'settings.modify-profile-card.error_message_email_already_exist'
          ),
          type: 'validate',
        })
      } else if (error.code === 'E_ROWNOTFOUND') {
        updateEmailFormController.setError('password', {
          message: t(
            'settings.modify-profile-card.error_password_email_update'
          ),
          type: 'validate',
        })
      }
    }
    if (isSuccessUpdateEmail) {
      toast.success(t('settings.modify-profile-card.success_update_profile'))
      setIsEmailValidateModalOpen(false)
    }
  }, [
    errorUpdateEmail,
    isErrorUpdateEmail,
    isSuccessUpdateEmail,
    updateEmailFormController, t
  ])

  //Dialog button
  const usernameChangeButton = (
    <ModifyUsernameDialog
      action={handleUsernameSubmit}
      isModalOpen={isUsernameModalOpen}
      setIsModalOpen={setIsUsernameModalOpen}
      usernameFormController={usernameFormController}
    />
  )
  const emailUpdateButton = (
    <ValidateEmailDialog
      action={handleEmailUpdate}
      isModalOpen={isEmailValidateModalOpen}
      setIsModalOpen={setIsEmailValidateModalOpen}
      updateEmailFormController={updateEmailFormController}
    />
  )
  const otpValidateButton = (
    <ValidateOtpDialog
      otpFormController={otpFormController}
      isModalOpen={isOtpModalOpen}
      resendOtp={handleEmailSubmit}
      setIsModalOpen={setIsOtpModalOpen}
      action={handleOtpSubmit}
    />
  )
  const emailChangeButton = (
    <ModifyEmailDialog
      emailFormController={emailFormController}
      isModalOpen={isEmailModalOpen}
      setIsModalOpen={setIsEmailModalOpen}
      action={handleEmailSubmit}
      currentUserEmail={userMe?.email || ''}
    />
  )
  const pictureChangeButton = (
    <ModifyProfilePictureDialog
      currentPicture={userProfilePicture}
      isModalOpen={isPictureModalOpen}
      selectedProfilePicture={newProfilePicture}
      errorMessage={errorPictureText}
      setIsModalOpen={setIsPictureModalOpen}
      action={handlePictureSubmit}
      addProfilePicture={addProfilePicture}
    />
  )
  const firstnameChangeButton = (
    <ModifyFirstnameDialog
      action={handleFirstnameSubmit}
      isModalOpen={isFirstnameModalOpen}
      setIsModalOpen={setIsFirstnameModalOpen}
      firstnameFormController={firstnameFormController}
    />
  )
  const lastnameChangeButton = (
    <ModifyLastnameDialog
      action={handleLastnameSubmit}
      isModalOpen={isLastnameModalOpen}
      setIsModalOpen={setIsLastnameModalOpen}
      lastnameFormController={lastnameFormController}
    />
  )

  //result that will be seen
  return (
    <>
      <ModifyProfileCard
        username={userMe?.username ?? ''}
        usernameButtonModal={usernameChangeButton}
        pictureButtonModal={pictureChangeButton}
        firstName={userMe?.firstName ?? ''}
        firstnameButtonModal={firstnameChangeButton}
        lastName={userMe?.lastName ?? ''}
        lastnameButtonModal={lastnameChangeButton}
        email={userMe?.email ?? ''}
        emailButtonModal={emailChangeButton}
      />
      {isEmailValidateModalOpen && emailUpdateButton}
      {isOtpModalOpen && otpValidateButton}
    </>
  )
}
