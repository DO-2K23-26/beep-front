import { useGetPrivateChannelsQuery } from '@beep/friend'
import { createContext } from 'react'
import { useParams } from 'react-router-dom'
import { PagePrivateChannel } from '../ui/page-private-channel'
import { UserDisplayedEntity } from '@beep/contracts'

const emptyUser: UserDisplayedEntity = {
  id: '/picture.svg',
  username: '',
  profilePicture: '',
}
export type PrivateChannelContextType = {
  user: UserDisplayedEntity
}
export const PrivateChannelContext = createContext<PrivateChannelContextType>({
  user: emptyUser,
})

export function PagePrivateChannelFeature() {
  const { channelId } = useParams<{ channelId: string }>()
  const { user } = useGetPrivateChannelsQuery(undefined, {
    selectFromResult: (state) => {
      if (state.data) {
        const channel = state.data.find((channel) => channel.id === channelId)
        return { user: channel?.users[0], isLoadingUser: state.isLoading }
      }
      return { user: undefined, isLoadingUser: state.isLoading }
    },
  })

  return (
    <PrivateChannelContext.Provider value={{ user: user ?? emptyUser }}>
      <PagePrivateChannel />
    </PrivateChannelContext.Provider>
  )
}
