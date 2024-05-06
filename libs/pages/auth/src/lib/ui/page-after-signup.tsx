import { Button, ButtonStyle, Icon } from '@beep/ui'

interface PageAfterSignupProps {
  onSignin: () => void
}

export default function PageAfterSignup({ onSignin }: PageAfterSignupProps) {
  return (
    <div
      style={{ backgroundImage: `url('/background.svg')` }}
      className="h-screen w-full bg-no-repeat bg-cover flex justify-center"
    >
      <div className="flex flex-col gap-6 justify-center items-start">
        <h1 className="font-extrabold">Check your emails</h1>
        <div className="flex flex-row gap-2 items-center">
          <h5>Your account has been successfully created, validate your email to be able to signin </h5>
          <Button style={ButtonStyle.NONE} onClick={onSignin}>
            <Icon name="lucide:arrow-right" />
          </Button>
        </div>
      </div>
    </div>
  )
}
