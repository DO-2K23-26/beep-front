import { Button, ButtonStyle, Icon } from '@beep/ui'

interface PageConfirmEmailProps {
  onSignin: () => void
}

export default function PageConfirmEmail({ onSignin }: PageConfirmEmailProps) {
  return (
    <div
      style={{ backgroundImage: `url('/background.svg')` }}
      className="h-screen w-full bg-no-repeat bg-cover flex justify-center"
    >
      <div className="flex flex-col gap-6 justify-center items-start">
        <h1 className="font-extrabold">Email already validated!</h1>
        <div className="flex flex-row gap-2 items-center">
          <h5>You can now log in</h5>
          <Button style={ButtonStyle.NONE} onClick={onSignin}>
            <Icon name="lucide:arrow-right" />
          </Button>
        </div>
      </div>
    </div>
  )
}
