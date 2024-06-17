import { ModifyUsernameEmail } from '@beep/settings'

interface ModifyProfileCardProps {}

export function ModifyProfileCard({}: ModifyProfileCardProps) {
  return (
    <div className="flex flex-col gap-8 bg-violet-400 p-8 rounded-lg w-1/2">
      <img
        className="w-9 min-w-[175px] h-9 min-h-[175px] object-cover rounded-xl"
        src={'/picture.svg'}
        alt={'-img'}
      />
      <ModifyUsernameEmail
        username={'hugo'}
        email={'hugo.hugo@hugo.hu'}
        openUsernameModal={function () {
          console.log('here')
        }}
        openEmailModal={function () {
          console.log('here')
        }}
      />
    </div>
  )
}
