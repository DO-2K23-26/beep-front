import { StoryFn, type Meta } from '@storybook/react'
import { Button, Modal, ModalContentProps } from '@beep/ui'

export default {
  component: Modal,
  title: 'Modals/DefaultModal',
} as Meta

const Content = (props: ModalContentProps) => {
  const { setOpen } = props

  return (
    <div className="py-4 px-5">
      <h3 className="h3 font-medium text-base text-neutral-400">Title</h3>
      <p className="text-sm text-neutral-350 mt-2 mb-6">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </p>
      <div className="flex justify-end">
        <Button onClick={() => setOpen && setOpen(false)}>Save changes</Button>
      </div>
    </div>
  )
}

const Template: StoryFn<typeof Modal> = (...args) => (
  <Modal trigger={<Button>Trigger</Button>} {...args}>
    <Content />
  </Modal>
)

export const Default = Template.bind({})

Default.args = {
  width: 400,
  defaultOpen: false,
  buttonClose: true,
}
