import { useModal } from '@beep/ui'
import MembersNavigation from '../ui/members-navigation'
import { useFetchAllUsersConnectedQuery, useFetchAllUsersQuery } from '@beep/user'
import { useEffect } from 'react'
import { backendUrl } from '@beep/contracts'
import { Transmit } from "@adonisjs/transmit-client";

const inviteCode = 'beep/invite/3421eg34ssa34y3'

export default function MembersNavigationFeature() {
  const { openModal, closeModal } = useModal()

  const { data: usersConnected, refetch: refetchUsersConnected } = useFetchAllUsersConnectedQuery()
  const { data: users, refetch: refetchUsers } = useFetchAllUsersQuery()

  useEffect(() => {
    const transmit = new Transmit({
      baseUrl: backendUrl,
    })

    const result = transmit.subscription(`users/state`)
    result.onMessage((message) => {
      refetchUsersConnected()
    })
  }, []);

  const onInviteMember = () => {
    console.log('Invite member')
    closeModal()
  }
  return (
    usersConnected === undefined || users === undefined ? (
      <></>
    ) : (
      <MembersNavigation
        usersConnected={usersConnected}
        users={users}
        onInviteMember={onInviteMember}
        openModal={openModal}
        closeModal={closeModal}
        inviteCode={inviteCode}
      />
    )
  )
}
