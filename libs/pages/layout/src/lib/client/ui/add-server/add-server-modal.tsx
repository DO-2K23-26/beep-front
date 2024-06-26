import { Button, Icon } from '@beep/ui'

interface AddServerModalProps {
  goToCreateServer: () => void
  goToJoinServer: () => void
}

export default function AddServerModal({
  goToCreateServer,
  goToJoinServer,
}: AddServerModalProps) {
  return (
    <div className="p-7 flex flex-col gap-5">
      <span className="flex flex-col gap-2">
        <h3 className="font-bold">Add a server</h3>
        <p className="text-slate-500">
          A server is where you can hang out with your friends
        </p>
      </span>

      <Button resize onClick={goToCreateServer} className="!px-3">
        <span className="flex flex-row w-full justify-between">
          <span className="flex flex-row">
            <Icon
              name="lucide:crown"
              className="mr-2 !fill-violet-200 !stroke-violet-200 !text-violet-200"
              pathColor="rgb(221, 214, 254)"
            />
            <p>Create a server</p>
          </span>
          <Icon name="lucide:chevron-right" className="mr-2" />
        </span>
      </Button>
      <span className="flex flex-row items-center">
        <div className="border-t border-gray-300 w-1/2"></div>
        <p className="px-3">or</p>
        <div className="border-t border-gray-300 w-1/2"></div>
      </span>
      <Button resize onClick={goToJoinServer} className="!px-3">
        <span className="flex flex-row w-full justify-between">
          <span className="flex flex-row">
            <Icon name="material-symbols:login-rounded" className="mr-2" />
            <p>Join a server</p>
          </span>
          <Icon name="lucide:chevron-right" className="mr-2" />
        </span>
      </Button>
    </div>
  )
}
