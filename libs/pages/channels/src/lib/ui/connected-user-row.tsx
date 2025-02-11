import { Icon } from "@beep/ui"
import { useFetchProfilePictureQuery } from "@beep/user"

interface ConnectedUserRowProps {
  userId: string
  name: string
  screenSharing?: boolean
  voiceMuted?: boolean
  camera?: boolean
}

export default function ConnectedUserRow({
  userId,
  name,
  screenSharing,
  voiceMuted,
  camera,
}: ConnectedUserRowProps) {
  const { currentData: userProfilePicture } =
    useFetchProfilePictureQuery(userId)

  return (
    <div className="flex flex-row justify-between items-center p-2 hover:bg-violet-400 rounded-xl transition-all cursor-pointer w-full group gap-2">
      <div className="flex flex-row gap-3 items-center">
        <img
          className="w-9 min-w-[36px] h-9 min-h-[36px] bg-violet-50 rounded-xl"
          src={userProfilePicture ?? '/picture.svg'}
          alt={'img'}
        />
        <h5 className="font-semibold text-xs truncate w-[75px] sm:w-[125px]">
          {name}
        </h5>
      </div>
      <div className="flex flex-row gap-2 bg-white bg-opacity-10 p-2 rounded-full">
        <Icon
          name={voiceMuted ? 'lucide:mic-off' : 'lucide:mic'}
          className="h-4 w-4"
        />
        {/*<Icon*/}
        {/*  name={screenSharing ? 'lucide:screen-share' : 'lucide:screen-share-off'}*/}
        {/*  className="h-4 w-4"*/}
        {/*/> TODO : remettre lorsque ce sera implemente*/}
        {camera && <Icon name="lucide:video" className="h-4 w-4" />}
      </div>
    </div>
  )
}
