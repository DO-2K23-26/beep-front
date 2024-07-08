import { ReactNode, useEffect, useState } from 'react'
import { useModal } from '../modal/use-modal'
import { ModalConfirmation } from './modal-confirmation'

export interface UseModalConfirmationProps {
  title: string
  description?: string | ReactNode
  action: () => void
  name?: string
  mode?: string
  warning?: string
  isDelete?: boolean
  placeholder?: string
}

export function useModalConfirmation() {
  const [modalConfirmation, openModalConfirmation] =
    useState<UseModalConfirmationProps>()

  const { openModal } = useModal()

  useEffect(() => {
    if (modalConfirmation?.isDelete) {
      openModal({
        content: (
          <ModalConfirmation
            title={modalConfirmation.title}
            description={modalConfirmation.description}
            name={modalConfirmation.name}
            warning={modalConfirmation.warning}
            callback={modalConfirmation.action}
            placeholder={modalConfirmation.placeholder}
            isDelete={modalConfirmation?.isDelete}
          />
        ),
      })
    } else {
      modalConfirmation?.action()
    }
  }, [modalConfirmation, openModal])

  return { openModalConfirmation }
}
