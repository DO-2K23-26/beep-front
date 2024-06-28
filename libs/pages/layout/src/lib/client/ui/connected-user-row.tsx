import { Icon } from "@beep/ui"
import { useFetchProfilePictureQuery } from "@beep/user"

interface ConnectedUserRowProps {
    userId: string,
    name: string,
    muted?: boolean,
    voiceMuted?: boolean
  }
  
export default function ConnectedUserRow({ userId, name, muted, voiceMuted }: ConnectedUserRowProps) {
    console.log('muted', muted)
    const userProfilePicture = useFetchProfilePictureQuery(userId).currentData
    return (
      <div className="flex flex-row justify-between items-center p-2 hover:bg-violet-400 rounded-xl transition-all cursor-pointer w-full group gap-2">
        <div className="flex flex-row gap-3 items-center">
          <img
            className="w-9 min-w-[36px] h-9 min-h-[36px] bg-violet-50 rounded-xl"
            src={userProfilePicture || '/picture.svg'}
            alt={'img'}
          />
          <h5 className="font-semibold text-xs truncate w-[75px] sm:w-[125px]">
            {name}
          </h5>
        </div>
        <Icon name={muted ? "lucide:volume-x" : "lucide:volume-2"} className="h-5 w-5" />
        <Icon name={voiceMuted ? "lucide:mic-off" : "lucide:mic"} className="h-5 w-5" />
        <div className="flex-row gap-3 items-center flex">
          <button className="hidden sm:flex invisible group-hover:visible"></button>
          <span className="flex flex-row gap-2"></span>
        </div>
      </div>
    )
  }
  