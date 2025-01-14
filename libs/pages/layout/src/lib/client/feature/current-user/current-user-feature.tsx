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
    isMuted,
    isVoiceMuted,
    isCamera,
    onMicrophone,
    onPhone,
    onCamera,
    methods,
  } = useCurrentUser()

  return (
    <CurrentUserProvider
      user={user}
      userProfilePicture={userProfilePicture}
      isLoadingUser={isLoadingUser}
      isLoadingProfilePicture={isLoadingProfilePicture}
      isMuted={isMuted}
      isVoiceMuted={isVoiceMuted}
      isCamera={isCamera}
      onMicrophone={onMicrophone}
      onPhone={onPhone}
      onCamera={onCamera}
      methods={methods}
    >
      <CurrentUser />
    </CurrentUserProvider>
  )
}
