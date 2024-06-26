import {
  AddServerStep,
  ServerStepsRender,
} from '../../feature/add-server-feature'

interface AddServerNavigationProps {
  closeModal: () => void
  onCreateServer: () => void
  onJoinServer: (serverId: string) => void
  serverStep: AddServerStep | undefined
  setServerStep: (nextStep: AddServerStep) => void
  render: ServerStepsRender
}

export default function AddServerNavigation({
  closeModal,
  onCreateServer,
  onJoinServer,
  serverStep,
  setServerStep,
  render,
}: AddServerNavigationProps) {
  const STEP_DELAY = 75
  const handleNextStep = (nextStep: AddServerStep) => {
    setTimeout(() => {
      setServerStep(nextStep)
    }, STEP_DELAY)
  }

  return serverStep === undefined ? render.undefined : render[serverStep]
}
