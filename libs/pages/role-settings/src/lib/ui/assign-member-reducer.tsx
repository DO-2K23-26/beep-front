import { MemberEntity } from '@beep/contracts'

export enum AssignAction {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
}

export type AddMemberAction = {
  type: AssignAction.ADD
  member: MemberEntity
}

export type RemoveMemberAction = {
  type: AssignAction.REMOVE
  member: MemberEntity
}

export type Actions = AddMemberAction | RemoveMemberAction

export type AssignMemberState = {
  members: MemberEntity[]
}

export const memberInitialState: AssignMemberState = {
  members: [] as MemberEntity[],
}

export function reducer(state: AssignMemberState, action: Actions) {
  switch (action.type) {
    case AssignAction.ADD:
      return {
        ...state,
        members: [...state.members, action.member],
      }
    case AssignAction.REMOVE:
      return {
        ...state,
        members: state.members.filter(
          (member) => member.id !== action.member.id
        ),
      }
    default:
      return state
  }
}
