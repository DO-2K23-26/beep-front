import { UserConnectedEntity } from '@beep/contracts'
import ConnectedUserRow from './connected-user-row'
import { useEffect } from 'react'

export interface ListConnectedUsersProps {
  users: UserConnectedEntity[]
}

export function ListConnectedUsers({ users }:ListConnectedUsersProps) {
  useEffect(() => {
    users.map((user)=> console.log("USER in LIST",user))
  }, [users])
  return (
    <>
      {users.map((user) => (
        <ConnectedUserRow key={user.id} userId={user.id} name={user.username} muted={user.muted} voiceMuted={user.voiceMuted} camera={user.camera} />
      ))}
    </>
  )
}
