// src/contexts/CurrentUserContext.tsx
import React, { createContext, useContext, useEffect } from 'react'
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
import { useDispatch, useSelector } from 'react-redux'

interface CurrentUserContextType {
  user: UserEntity | undefined
  userProfilePicture: string | undefined
  isLoadingUser: boolean
  isLoadingProfilePicture: boolean
  isErrorProfilePicture: boolean
  isSuccessProfilePicture: boolean
  isMuted: boolean
  isVoiceMuted: boolean
  isCamera: boolean
  onMicrophone: () => void
  onPhone: () => void
  onCamera: () => void
}

const CurrentUserContext = createContext<CurrentUserContextType | undefined>(
  undefined
)

export const CurrentUserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: userMe, isLoading: isLoadingUser } = useGetMeQuery()
  const server = useSelector((state: RootState) => state.servers.server)
  const { isMuted, isVoiceMuted, isCamera } = useSelector(getUserState)
  const dispatch = useDispatch()
  const {
    currentData: userProfilePicture,
    isLoading: isLoadingProfilePicture,
    isError: isErrorProfilePicture,
    isSuccess: isSuccessProfilePicture,
  } = useFetchProfilePictureQuery(userMe?.id ?? skipToken, {
    skip:
      userMe === undefined ||
      userMe.profilePicture === 'default_profile_picture.png',
  })
  const { videoDevice, audioInputDevice } = useSelector(getVoiceState)
  const { refetch } = useGetCurrentStreamingUsersQuery(server?.id ?? '')

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

  useEffect(() => {
    if (!server?.id) return
    TransmitSingleton.subscribe(`users/${server?.id}/state`, () => {
      refetch()
    })
  }, [refetch, server])

  return (
    <CurrentUserContext.Provider
      value={{
        user: userMe,
        userProfilePicture,
        isLoadingUser,
        isLoadingProfilePicture,
        isSuccessProfilePicture,
        isErrorProfilePicture,
        isMuted,
        isVoiceMuted,
        isCamera,
        onMicrophone,
        onPhone,
        onCamera,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  )
}

export const useCurrentUser = () => {
  const context = useContext(CurrentUserContext)
  if (!context) {
    throw new Error('useCurrentUser must be used within a CurrentUserProvider')
  }
  return context
}
