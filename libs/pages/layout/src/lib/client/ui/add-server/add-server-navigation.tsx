import {
  AddServerStep,
  ServerStepsRender,
} from '../../feature/add-server-feature'

interface AddServerNavigationProps {
  serverStep: AddServerStep | undefined
  render: ServerStepsRender
}

export default function AddServerNavigation({
  serverStep,
  render,
}: AddServerNavigationProps) {

  return serverStep === undefined ? render.undefined : (render as any)[serverStep]
}
