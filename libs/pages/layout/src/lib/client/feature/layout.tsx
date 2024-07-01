import { responsiveActions } from '@beep/responsive'
import { AppDispatch } from '@beep/store'
import { PropsWithChildren, ReactElement } from 'react'
import { useDispatch } from 'react-redux'
import LayoutPage from '../ui/layout-page'

interface LayoutProps {
  rightPanel: ReactElement | undefined
  leftPanel: ReactElement | undefined
}

export function Layout({
  children,
  rightPanel,
  leftPanel,
}: PropsWithChildren<LayoutProps>) {
  const dispatch = useDispatch<AppDispatch>()
  const hideRightDiv = () => {
    dispatch(responsiveActions.manageRightPane())
  }
  return (
    <LayoutPage
      leftPanel={leftPanel}
      rightPanel={rightPanel}
      hideRightDiv={hideRightDiv}
    >
      {children}
    </LayoutPage>
  )
}
