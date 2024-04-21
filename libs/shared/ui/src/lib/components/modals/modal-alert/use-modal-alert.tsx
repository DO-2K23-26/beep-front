import { ModalContext } from '@beep/ui'
import { useContext } from 'react'

export default function useModalAlert () {
  const { setModalAlertOpen } = useContext(ModalContext)

  return { setModalAlertOpen }
}
