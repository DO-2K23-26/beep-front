import { UserConnectedEntity, UserDisplayedEntity } from '@beep/contracts'
import DisplayMemberFeature from '../feature/display-member-feature'

export interface ListMembersProps {
  usersConnected: UserConnectedEntity[]
  users: UserDisplayedEntity[]
}

export function ListMembers({ usersConnected, users }: ListMembersProps) {
  const connectedUsers = users.filter(
    (u) => usersConnected.find((uc) => uc.id === u.id) !== undefined
  )
  connectedUsers.sort((a, b) => (a.username > b.username ? 1 : -1))
  const disconnectedUsers = users.filter(
    (u) => usersConnected.find((uc) => uc.id === u.id) === undefined
  )
  disconnectedUsers.sort((a, b) => (a.username > b.username ? 1 : -1))
  const sortedUser = [...connectedUsers, ...disconnectedUsers]

  return (
    <>
      {sortedUser.map((user) => (
        <DisplayMemberFeature
          key={user.id}
          user={user}
          isConnected={
            usersConnected.find((u) => u.id === user.id) !== undefined
          }
        />
      ))}
    </>
  )
}
