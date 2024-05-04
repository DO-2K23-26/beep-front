import { responsiveActions } from '@beep/responsive'
import { AppDispatch } from '@beep/store'
import { PropsWithChildren } from 'react'
import { useDispatch } from 'react-redux'
import LayoutPage from '../ui/layout-page'

export function Layout({ children }: PropsWithChildren) {
  const dispatch = useDispatch<AppDispatch>()
  const hideRightDiv = () => {
    dispatch(responsiveActions.manageRightPane())
  }
  return <LayoutPage hideRightDiv={hideRightDiv}>{children}</LayoutPage>
}
