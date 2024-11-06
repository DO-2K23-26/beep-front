import { UserEntity } from '@beep/contracts'
import { useGetCurrentStreamingUsersQuery } from '@beep/server'
import { RootState } from '@beep/store'
import {
  getUserState,
  useFetchProfilePictureQuery,
  useGetMeQuery,
  userActions,
} from '@beep/user'
import { TransmitSingleton } from '@beep/utils'
import { getVoiceState } from '@beep/voice'
import { skipToken } from '@reduxjs/toolkit/query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import CurrentUser from '../ui/current-user'

export default function CurrentUserFeature() {
  const { data: userMe } = useGetMeQuery()
  const server = useSelector((state: RootState) => state.servers.server)
  const { isMuted, isVoiceMuted, isCamera } = useSelector(getUserState)
  const dispatch = useDispatch()
  const { currentData: userProfilePicture } = useFetchProfilePictureQuery(
    userMe?.id ?? skipToken,
    {
      skip:
        userMe === undefined ||
        userMe.profilePicture === 'default_profile_picture.png',
    }
  )
  const { videoDevice, audioInputDevice } = useSelector(getVoiceState)
  const onMicrophone = () => {
    if (server) dispatch(userActions.toggleIsVoiceMuted(server.id))
    if (isVoiceMuted) {
      dispatch({ type: 'START_MIC', payload: audioInputDevice })
    } else {
      dispatch({ type: 'STOP_MIC' })
    }
  }

  const onPhone = () => {
    if (server) dispatch(userActions.toggleIsMuted(server.id))
  }
  const onCamera = () => {
    if (server) {
      dispatch(userActions.toggleIsCamera(server.id))
      if (!isCamera) {
        dispatch({ type: 'START_CAM', payload: videoDevice })
      } else {
        dispatch({ type: 'STOP_CAM' })
      }
    }
  }

  const { refetch } = useGetCurrentStreamingUsersQuery(server?.id ?? '')
  useEffect(() => {
    if (!server?.id) return
    TransmitSingleton.subscribe(`users/${server?.id}/state`, () => {
      refetch()
    })
  }, [refetch, server])

  const currentUser: UserEntity = userMe
    ? {
        id: userMe.id,
        email: userMe.email,
        username: userMe.username,
        firstname: userMe.firstname,
        lastname: userMe.lastname,
        profilePicture: userProfilePicture ?? '/picture.svg',
        verifiedAt: new Date(),
      }
    : {
        id: '1',
        email: 'rapidement@gmail.com',
        username: 'rapidement',
        firstname: 'Dorian',
        lastname: 'Grasset',
        profilePicture: '/picture.svg',
        verifiedAt: new Date(),
      }

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      username: currentUser.username,
      email: currentUser.email,
      'actual-password': '',
      'new-password': '',
      'confirm-password': '',
    },
  })

  return (
    <CurrentUser
      user={currentUser}
      isMuted={isMuted}
      isVoiceMuted={isVoiceMuted}
      isCamera={isCamera}
      onMicrophone={onMicrophone}
      onPhone={onPhone}
      onCamera={onCamera}
      methods={methods}
    />
  )
}
