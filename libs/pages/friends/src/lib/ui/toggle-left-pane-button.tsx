import { responsiveActions } from '@beep/responsive'
import { AppDispatch } from '@beep/store'
import { cn } from '@beep/transmit'
import { ButtonShadCn, Icon } from '@beep/ui'
import { useDispatch } from 'react-redux'

export function ToggleLeftPaneButton() {
  const dispatch = useDispatch<AppDispatch>()
  const toggleLeftPane = () => {
    dispatch(responsiveActions.toggleLeftPane())
  }
  return (
    <ButtonShadCn
      size={'responsiveSquare'}
      variant={'hoverRounded'}
      className={cn('lg:hidden !bg-violet-300')}
      onClick={toggleLeftPane}
    >
      <Icon name="lucide:arrow-left" className="w-4 h-4" />
    </ButtonShadCn>
  )
}
