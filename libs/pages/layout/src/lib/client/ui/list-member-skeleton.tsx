import { DisplayMemberSkeleton } from './display-member-skeleton'

export function ListMemberSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <DisplayMemberSkeleton key={"memberSkeleton:"+index} />
      ))}
    </>
  )
}
