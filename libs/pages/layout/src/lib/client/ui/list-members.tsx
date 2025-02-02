import { MemberEntity, UserConnectedEntity } from '@beep/contracts'
import { UserPopoverFeature } from '@beep/ui'
import DisplayMemberFeature from '../feature/display-member-feature'

export interface ListMembersProps {
  usersConnected: UserConnectedEntity[]
  members: MemberEntity[]
}

export function ListMembers({ usersConnected, members }: ListMembersProps) {
  const connectedUsers = members.filter(
    (m: MemberEntity) =>
      usersConnected.find((uc) => uc.id === m.userId) !== undefined
  )
  connectedUsers.sort((a, b) => (a.nickname > b.nickname ? 1 : -1))
  const disconnectedUsers = members.filter(
    (m: MemberEntity) =>
      usersConnected.find((uc) => uc.id === m.userId) === undefined
  )
  disconnectedUsers.sort((a, b) => (a.nickname > b.nickname ? 1 : -1))
  const sortedUser = [...connectedUsers, ...disconnectedUsers]

  return (
    <>
      {sortedUser.map((member) => (
        <UserPopoverFeature
          key={member.id}
          userId={member.userId}
          serverId={member.serverId}
        >
          <DisplayMemberFeature
            member={member}
            isConnected={
              usersConnected.find((u) => u.id === member.userId) !== undefined
            }
          />
        </UserPopoverFeature>
      ))}
    </>
  )
}
