import { useContext } from 'react'
import { ModalContext } from '../modal/modal-root'

export default function useModalAlert () {
  const { setModalAlertOpen } = useContext(ModalContext)

  return { setModalAlertOpen }
}
