import { Modal } from '@beep/ui'
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react'
import ModalAlert from '../modal-alert/modal-alert'

export interface ModalOptions {
  width: number
  height: number | null
}

export interface DefaultContextProps {
  openModal: boolean
  setOpenModal: (openModal: boolean) => void
  setContentModal: Dispatch<SetStateAction<ReactNode>>
  setOptionsModal: (optionsModal: ModalOptions) => void
  optionsModal: ModalOptions
  alertClickOutside: boolean
  enableAlertClickOutside: (mustConfirm: boolean) => void
  modalAlertOpen: boolean
  setModalAlertOpen: (alertModalOpen: boolean) => void
  alertModalChoice: boolean | undefined
  setAlertModalChoice: (alertModalChoice: boolean | undefined) => void
}

export const defaultContext: DefaultContextProps = {
  openModal: false,
  setOpenModal: () => true,
  setContentModal: () => <></>,
  setOptionsModal: () => {},
  optionsModal: {
    width: 488,
    height: null,
  },
  alertClickOutside: false,
  enableAlertClickOutside: () => {},
  modalAlertOpen: false,
  setModalAlertOpen: () => {},
  alertModalChoice: undefined,
  setAlertModalChoice: () => {},
}

export const ModalContext = createContext<DefaultContextProps>(defaultContext)

export interface ModalProviderProps {
  children: ReactNode
}

export const ModalProvider = (props: ModalProviderProps) => {
  const [openModal, setOpenModal] = useState(false)
  const [contentModal, setContentModal] = useState<any>(<></>)
  const [optionsModal, setOptionsModal] = useState<ModalOptions>({
    width: 488,
    height: null,
  })
  const [alertClickOutside, enableAlertClickOutside] = useState(false)
  const [modalAlertOpen, setModalAlertOpen] = useState(false)
  const [alertModalChoice, setAlertModalChoice] = useState<boolean | undefined>(
    undefined
  )

  return (
    <ModalContext.Provider
      value={{
        openModal,
        setOpenModal,
        setContentModal,
        setOptionsModal,
        optionsModal,
        alertClickOutside,
        enableAlertClickOutside,
        setModalAlertOpen,
        modalAlertOpen,
        alertModalChoice,
        setAlertModalChoice,
      }}
    >
      <Modal
        externalOpen={openModal}
        setExternalOpen={setOpenModal}
        width={optionsModal.width}
        height={optionsModal.height}
      >
        {contentModal}
      </Modal>
      <ModalAlert isOpen={modalAlertOpen} />
      {props.children}
    </ModalContext.Provider>
  )
}
