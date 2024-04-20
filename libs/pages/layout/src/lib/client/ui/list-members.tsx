import { UserEntity } from '@beep/contracts'
import DisplayMemberFeature from '../feature/display-member-feature'

export interface ListMembersProps {
  users: UserEntity[]
}

export function ListMembers({ users }: ListMembersProps) {
  return (
    <>
      {users.map((user) => (
        <DisplayMemberFeature key={user.id} user={user} />
      ))}
    </>
  )
}
