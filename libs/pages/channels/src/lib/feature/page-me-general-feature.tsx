import { useDispatch } from 'react-redux'
import { PageMeGeneral } from '../ui/page-me-general'
import { responsiveActions } from '@beep/responsive'
import { AppDispatch } from '@beep/store'

export function PageMeGeneralFeature() {
  const dispatch = useDispatch<AppDispatch>()
  const hideRightDiv = () => {
    dispatch(responsiveActions.toggleRightPane())
  }
  const hideLeftDiv = () => {
    dispatch(responsiveActions.toggleLeftPane())
  }
  return <PageMeGeneral hideLeftDiv={hideLeftDiv} hideRightDiv={hideRightDiv} />
}
