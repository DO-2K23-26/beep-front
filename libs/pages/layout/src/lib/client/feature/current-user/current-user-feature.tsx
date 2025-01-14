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
    isMuted,
    isVoiceMuted,
    isCamera,
    onMicrophone,
    onPhone,
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
      isMuted={isMuted}
      isVoiceMuted={isVoiceMuted}
      isCamera={isCamera}
      onMicrophone={onMicrophone}
      onPhone={onPhone}
      onCamera={onCamera}
    >
      <CurrentUser />
    </CurrentUserProvider>
  )
}
