import {
  useFetchProfilePictureQuery,
  useGetMeQuery,
  useSendOtpEmailMutation,
  useUpdateMeMutation,
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

import { useTranslation } from 'react-i18next'

// This is the profile page of the user account, you can find it in the settings
export function ModifyProfileCardFeature() {
  const { t } = useTranslation()

  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isPictureModalOpen, setIsPictureModalOpen] = useState(false)
  const [isFirstnameModalOpen, setIsFirstnameModalOpen] = useState(false)
  const [isLastnameModalOpen, setIsLastnameModalOpen] = useState(false)
  const [newProfilePicture, setNewProfilePicture] = useState<string | null>(
    null
  )
  const [errorPictureText, setErrorPictureText] = useState('')
  const [sendOtpEmail] = useSendOtpEmailMutation() // Mutation to send OTP to the new email
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
    setIsFirstnameModalOpen(false)
    const formData = new FormData()
    formData.append('firstName', data.firstName)
    updateMe(formData)
    setIsFirstnameModalOpen(false)
    firstnameFormController.reset()
  })
  const handleLastnameSubmit = lastnameFormController.handleSubmit((data) => {
    setIsLastnameModalOpen(false)
    const formData = new FormData()
    formData.append('lastName', data.lastName)
    updateMe(formData)
    setIsLastnameModalOpen(false)
    lastnameFormController.reset()
  })
  const handleEmailSubmit = emailFormController.handleSubmit((data) => {
    setIsEmailModalOpen(false)
    const requestData = {email : currentUserEmail}
    sendOtpEmail(requestData) // Send OTP request to the current user's email
    setIsEmailModalOpen(false)
    lastnameFormController.reset()
    })

  // Verify the OTP entered by the user
  // const handleOtpSubmit = () => {
  //   verifyOtpEmail({ email: newEmail, otp })
  //     .then(() => {
  //       toast.success('Email updated successfully!')
  //       setOtpModalOpen(false) // Close OTP modal
  //     })
  //     .catch(() => {
  //       toast.error('Invalid OTP. Please try again.')
  //     })
  // }
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
      } else {
        toast.error('An error occurred while updating the username')
        setIsUsernameModalOpen(false)
      }
    }
  }, [errorUpdateMe, isErrorUpdateMe, usernameFormController])

  useEffect(() => {
    if (isSuccessUpdateMe) {
      setIsUsernameModalOpen(false)
    }
  }, [isSuccessUpdateMe])

  //Dialog button
  const usernameChangeButton = (
    <ModifyUsernameDialog
      action={handleUsernameSubmit}
      isModalOpen={isUsernameModalOpen}
      setIsModalOpen={setIsUsernameModalOpen}
      usernameFormController={usernameFormController}
    />
  )
  const emailChangeButton = (
    <ModifyEmailDialog
      emailFormController={emailFormController}
      isModalOpen={isEmailModalOpen}
      setIsModalOpen={setIsEmailModalOpen}
      action={handleEmailSubmit} // Pass the current user's email here
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
  )
}
