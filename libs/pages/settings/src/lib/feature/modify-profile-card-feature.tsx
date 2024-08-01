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

export function ModifyProfileCardFeature() {
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isPictureModalOpen, setIsPictureModalOpen] = useState(false)
  const [newProfilePicture, setNewProfilePicture] = useState<string | null>(
    null
  )
  const [errorPictureText, setErrorPictureText] = useState('')
  const [updateMe, result] = useUpdateMeMutation()
  const { data: userMe } = useGetMeQuery()
  useEffect(() => {
    if (result.isSuccess) {
      toast.success('Update successful')
    } else if (result.isError) {
      toast.error('Something went wrong when updating your profile')
    }
  }, [result])

  const errorPictureNotFilled =
    'Choose a picture by clicking on the button first'
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
  const handleUsernameSubmit = usernameFormController.handleSubmit((data) => {
    setIsPictureModalOpen(false)
    const formData = new FormData()
    formData.append('username', data.username)
    updateMe(formData)
    setIsUsernameModalOpen(false)
    usernameFormController.reset()
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
  return (
    <ModifyProfileCard
      email={userMe?.email ?? ''}
      username={userMe?.username ?? ''}
      usernameButtonModal={usernameChangeButton}
      emailButtonModal={emailChangeButton}
      pictureButtonModal={pictureChangeButton}
    />
  )
}
