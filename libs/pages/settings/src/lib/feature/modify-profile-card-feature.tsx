import {
  useFetchProfilePictureQuery,
  useGetMeQuery,
  useSendOtpEmailMutation,
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
  const { data: userMe } = useGetMeQuery()
  const currentUserEmail = userMe?.email || ''
  // useEffect(() => {
  //   if (isSuccessUpdateMe) {
  //     toast.success('Update successful')
  //   } else if (isErrorUpdateMe) {
  //     toast.error('Something went wrong when updating your profile')
  //   }
  // }, [isErrorUpdateMe, isSuccessUpdateMe])

  const errorPictureNotFilled = t(
    'settings.modify-profile-card.picture_not_filled'
  )
  const emailFormController = useForm({
    mode: 'onChange',
    defaultValues: {
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
  const handleEmailUpdate = emailFormController.handleSubmit((data) => {
    const formData = new FormData()
    formData.append('email', data.email)
    updateMe(formData)
  })

  // Send email to generate otp code
  const handleEmailSubmit = emailFormController.handleSubmit((data) => {
    const requestData = { email: currentUserEmail }
    sendOtpEmail(requestData)
    setIsEmailModalOpen(false)
    setIsOtpModalOpen(true)
  })

  // Verify the OTP entered by the user
  const handleOtpSubmit = otpFormController.handleSubmit((data) => {
    const requestData = { email: currentUserEmail, otp: data.otp }
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
          message: 'This username already exists',
          type: 'validate',
        })
      } else if (error.code === 'E_EMAILALREADYEXISTS') {
        emailFormController.setError('email', {
          message: 'This email already exists',
          type: 'validate',
        })
      } else {
        toast.error('An error occurred while updating')
        setIsUsernameModalOpen(false)
        setIsEmailValidateModalOpen(false)
      }
    }
  }, [errorUpdateMe, isErrorUpdateMe, usernameFormController, emailFormController])

  // use effect of the otp email send
  useEffect(() => {
    if (isSuccessOtpEmail) {
      toast.success('Email sent successfully! Please check your inbox.')
    } if (isErrorOtpEmail || errorOtpEmail) {
      toast.error('Failed to send email. Please try again.')
    }
  }, [isSuccessOtpEmail, isErrorOtpEmail, errorOtpEmail])

  // use effect of the verification of the otp code
  useEffect(() => {
    if (isSuccessOtpVerify) {
      toast.success('Valid code !')
      setIsEmailValidateModalOpen(true)
      setIsOtpModalOpen(false)
    }
    if (isErrorOtpVerify || errorOtpVerify) {
      toast.error('An error occured. Please try again.')
    }
  }, [isSuccessOtpVerify, isErrorOtpVerify, errorOtpVerify, otpFormController])

  useEffect(() => {
    if (isSuccessUpdateMe) {
      setIsUsernameModalOpen(false)
    }
  }, [isSuccessUpdateMe, usernameFormController])

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
      emailFormController={emailFormController}
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
        currentUserEmail={currentUserEmail}
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
