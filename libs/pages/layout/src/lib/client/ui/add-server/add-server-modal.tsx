import { Button } from '@beep/ui'

interface AddServerModalProps {
  goToCreateServer: () => void
  goToJoinServer: () => void
}

export default function AddServerModal({
  goToCreateServer,
  goToJoinServer,
}: AddServerModalProps) {
  return (
    <div className="p-7 flex flex-col gap-3">
      <h3 className="font-bold">Add a server</h3>
      <p>A server is where you can hang out with your friends</p>
      <Button onClick={goToCreateServer}>Create a server</Button>
      <span>
        <hr />
        <p>or</p>
        <hr />
      </span>

      <Button onClick={goToJoinServer}>Join a server</Button>
    </div>
  )
}
