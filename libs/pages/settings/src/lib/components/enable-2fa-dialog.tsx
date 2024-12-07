import { Dialog, DialogComponent, DialogContent, DialogTrigger } from '@beep/ui'
import React, { useState } from 'react'

interface Enable2FADialog {
  action: () => void
  isModalOpen: boolean
  setIsModalOpen: (value: boolean) => void
  trigger: React.ReactNode
  step: Step
}

export interface Step {
  title: string
  content: React.ReactNode
}
export function Enable2FADialog({
  action,
  isModalOpen,
  setIsModalOpen,
  trigger,
  step,
}: Enable2FADialog) {
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen} modal={true}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      {step.content}
    </Dialog>
  )
}
