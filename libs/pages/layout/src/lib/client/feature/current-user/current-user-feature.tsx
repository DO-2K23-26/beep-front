import CurrentUser from '../../ui/current-user'
import { CurrentUserProvider, useCurrentUser } from './current-user-context'

export function CurrentUserFeature() {
  return (
    <CurrentUserProvider>
      <CurrentUserContainer />
    </CurrentUserProvider>
  )
}

function CurrentUserContainer() {
  const {
    user,
    userProfilePicture,
    isLoadingUser,
    isLoadingProfilePicture,
    isSuccessProfilePicture,
    isErrorProfilePicture,
    isScreenShared,
    isVoiceMuted,
    isCamera,
    onMicrophone,
    onScreenShare,
    onCamera,
  } = useCurrentUser()

  return (
    <CurrentUserProvider
      user={user}
      userProfilePicture={userProfilePicture}
      isLoadingUser={isLoadingUser}
      isLoadingProfilePicture={isLoadingProfilePicture}
      isErrorProfilePicture={isErrorProfilePicture}
      isSuccessProfilePicture={isSuccessProfilePicture}
      isScreenShared={isScreenShared}
      isVoiceMuted={isVoiceMuted}
      isCamera={isCamera}
      onMicrophone={onMicrophone}
      onScreenShare={onScreenShare}
      onCamera={onCamera}
    >
      <CurrentUser />
    </CurrentUserProvider>
  )
}
