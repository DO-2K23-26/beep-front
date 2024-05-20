import { UserConnectedEntity } from '@beep/contracts'
import ConnectedUserRow from './connected-user-row'

export interface ListConnectedUsersProps {
  users: UserConnectedEntity[]
}

export function ListConnectedUsers({ users }:ListConnectedUsersProps) {
  return (
    <>
      {users.map((user) => (
        <ConnectedUserRow key={user.id} userId={user.id} name={user.username}/>
      ))}
    </>
  )
}
