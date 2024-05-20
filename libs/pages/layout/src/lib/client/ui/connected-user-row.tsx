interface ConnectedUserRowProps {
    name: string
    profilePicture?: string
  }
  
  export default function ConnectedUserRow({ name, profilePicture }: ConnectedUserRowProps) {
    return (
      <div className="flex flex-row justify-between items-center p-2 hover:bg-violet-400 rounded-xl transition-all cursor-pointer w-full group gap-2">
        <div className="flex flex-row gap-3 items-center">
          <img
            className="w-9 min-w-[36px] h-9 min-h-[36px] bg-violet-50 rounded-xl"
            src={profilePicture || '/picture.svg'}
            alt={'img'}
          />
          <h5 className="font-semibold text-xs truncate w-[75px] sm:w-[125px]">
            {name}
          </h5>
        </div>
        <div className="flex-row gap-3 items-center flex">
          <button className="hidden sm:flex invisible group-hover:visible"></button>
          <span className="flex flex-row gap-2"></span>
        </div>
      </div>
    )
  }
  