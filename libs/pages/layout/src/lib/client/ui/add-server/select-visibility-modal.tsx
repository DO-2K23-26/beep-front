import { Button, Icon } from '@beep/ui'

interface SelectVisibilityModalProps {
  createPrivateServer: () => void
  createPublicServer: () => void
}

export default function SelectVisibilityModal({
  createPrivateServer,
  createPublicServer,
}: SelectVisibilityModalProps) {
  return (
    <div className="p-7 flex flex-col gap-5">
      <span className="flex flex-col gap-2">
        <h3 className="font-bold">Tell us a little more about what you want</h3>
      </span>

      <Button resize onClick={createPrivateServer} className="!px-3 !py-7">
        <span className="flex flex-row w-full justify-between">
          <span className="flex flex-row">
            <Icon name="material-symbols:lock-outline" className="mr-2" />
            <span className="items-left">
              <p>
                Create a <u>private</u> server
              </p>
              <p className="text-left mr-0 text-xs opacity-50 font-normal">
                For you and your friends
              </p>
            </span>
          </span>
          <Icon name="lucide:chevron-right" className="mr-2" />
        </span>
      </Button>
      <span className="flex flex-row items-center">
        <div className="border-t border-gray-300 w-1/2"></div>
        <p className="px-3">or</p>
        <div className="border-t border-gray-300 w-1/2"></div>
      </span>
      <Button resize onClick={createPublicServer} className="!px-3 !py-7">
        <span className="flex flex-row w-full justify-between">
          <span className="flex flex-row">
            <Icon name="ri:team-line" className="mr-2" />
            <span className="items-left">
              <p>
                Create a <u>public</u> server
              </p>
              <p className="text-left mr-0 text-xs opacity-50 font-normal">
                To build your community
              </p>
            </span>
          </span>
          <Icon name="lucide:chevron-right" className="mr-2" />
        </span>
      </Button>
    </div>
  )
}
