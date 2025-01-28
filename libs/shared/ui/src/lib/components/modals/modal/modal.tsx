import {
  cloneElement,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { ModalContext } from './modal-root'
import * as Dialog from '@radix-ui/react-dialog'
import useModalAlert from '../modal-alert/use-modal-alert'
import { Icon } from '../../icons/icon'

export interface ModalProps {
  children: ReactElement
  trigger?: ReactNode
  defaultOpen?: boolean
  buttonClose?: boolean
  width?: number
  className?: string
  externalOpen?: boolean
  setExternalOpen?: (e: boolean) => void
}

export interface ModalContentProps {
  setOpen?: (open: boolean) => void
}

export const Modal = (props: ModalProps) => {
  const {
    children,
    trigger,
    width = 478,
    className = '',
    defaultOpen = false,
    buttonClose = true,
    externalOpen = false,
    setExternalOpen,
  } = props

  const [open, setOpen] = useState(defaultOpen)
  const { setModalAlertOpen } = useModalAlert()

  const {
    setAlertModalChoice,
    enableAlertClickOutside,
    alertClickOutside,
    alertModalChoice,
  } = useContext(ModalContext)

  useEffect(() => {
    if (!open)
      // when the modal just open nothing should be dirty in the modal
      enableAlertClickOutside && enableAlertClickOutside(false)
  }, [enableAlertClickOutside, open])

  useEffect(() => {
    if (alertModalChoice) {
      setOpen(false)
      setAlertModalChoice && setAlertModalChoice(undefined)
    }
  }, [alertModalChoice, setAlertModalChoice])

  useEffect(() => {
    if (alertClickOutside && setAlertModalChoice && alertModalChoice) {
      setExternalOpen ? setExternalOpen(false) : setOpen(false)
      setModalAlertOpen(false)
      setAlertModalChoice(undefined)
      enableAlertClickOutside && enableAlertClickOutside(false)
    }
  }, [
    alertModalChoice,
    alertClickOutside,
    setAlertModalChoice,
    setExternalOpen,
    setModalAlertOpen,
    enableAlertClickOutside,
  ])

  return (
    <Dialog.Root
      open={externalOpen || open}
      onOpenChange={
        setExternalOpen
          ? () => setExternalOpen(!externalOpen)
          : () => setOpen(!open)
      }
    >
      {trigger && <div onClick={() => setOpen(!open)}>{trigger}</div>}
      <Dialog.Portal>
        <Dialog.Overlay
          data-testid="overlay"
          onClick={(event) => {
            if (alertClickOutside) {
              event.preventDefault()
              setModalAlertOpen(true)
            } else {
              setExternalOpen ? setExternalOpen(false) : setOpen(false)
            }
          }}
          className="modal__overlay flex fixed top-0 left-0 bg-neutral-700/50 w-full h-screen z-40"
        />
        <Dialog.Content
          onPointerDownOutside={(event) => {
            event.preventDefault()
          }}
          style={{ width: `${width}px` }}
          className={`modal__content fixed top-[84px] w-[350px] left-1/2 bg-white rounded-md shadow-[0_0_32px_rgba(0,0,0,0.08)] z-[42] ${className}`}
        >
          <div className="max-h-[80vh] overflow-auto border">
            {cloneElement(children, {
              setOpen: setExternalOpen || setOpen,
            })}
            {buttonClose && (
              <Dialog.Close className="absolute top-4 right-4">
                <span className="flex w-7 h-7 items-center justify-center bg-neutral-200 text-neutral-350 hover:text-neutral-400 hover:bg-neutral-250 ease-out duration-300 rounded-full">
                  <Icon name="iconoir:xmark" />
                </span>
              </Dialog.Close>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
