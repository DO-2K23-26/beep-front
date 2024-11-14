import {
  useFetchProfilePictureQuery,
  useGetMeQuery,
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
  const [updateMe, result] = useUpdateMeMutation()
  const { data: userMe } = useGetMeQuery()
  useEffect(() => {
    if (result.isSuccess) {
      toast.success(t('settings.modify-profile-card.successfull_update'))
    } else if (result.isError) {
      toast.error(t('settings.modify-profile-card.error_update'))
    }
  }, [result])

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
    setIsUsernameModalOpen(false)
    usernameFormController.reset()
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
    usernameFormController.reset()
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
      action={handleEmailSubmit}
      isModalOpen={isEmailModalOpen}
      setIsModalOpen={setIsEmailModalOpen}
      emailFormController={emailFormController}
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
