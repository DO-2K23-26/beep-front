import { MemberEntity, Permissions, UserConnectedEntity } from '@beep/contracts'
import { UserPopoverFeature } from '@beep/ui'
import { useContext } from 'react'
import DisplayMemberFeature from '../feature/display-member-feature'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ServerContext } from '@beep/pages/channels'
import { getUserState } from '@beep/user'
import { useSelector } from 'react-redux'
export interface ListMembersProps {
  usersConnected: UserConnectedEntity[]
  members: MemberEntity[]
}

export function ListMembers({ usersConnected, members }: ListMembersProps) {
  const { myMember } = useContext(ServerContext)
  const { payload } = useSelector(getUserState)

  const isNicknameEditable = (member?: MemberEntity) => {
    if (myMember?.hasOnePermissions([Permissions.MANAGE_NICKNAMES])) {
      return true
    } else if (payload?.sub === member?.userId && myMember) {
      return myMember.hasOnePermissions([Permissions.CHANGE_NICKNAME])
    }
    return false
  }
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
      {sortedUser.map((member) => {
        return (
          <UserPopoverFeature
            key={member.id}
            userId={member.userId}
            serverId={member.serverId}
            isNicknameEditable={isNicknameEditable(member)}
          >
            <DisplayMemberFeature
              member={member}
              isConnected={
                usersConnected.find((u) => u.id === member.userId) !== undefined
              }
            />
          </UserPopoverFeature>
        )
      })}
    </>
  )
}
