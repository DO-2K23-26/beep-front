import { StoryFn, type Meta } from '@storybook/react'
import { ModalConfirmation, ModalConfirmationProps } from '@beep/ui'

export default {
  component: ModalConfirmation,
  title: 'Modals/ModalConfirmation',
  parameters: {
    layout: 'centered',
  },
} as Meta

const Template: StoryFn<ModalConfirmationProps> = (args) => (
  <ModalConfirmation {...args} />
)

export const Default = Template.bind({})
Default.args = {
  title: 'Confirmation Modal',
  description: 'Please confirm your action.',
  name: 'Item',
  callback: () => console.log('Confirmed'),
}

export const DeleteConfirmation = Template.bind({})
DeleteConfirmation.args = {
  title: 'Delete Item',
  description: 'Are you sure you want to delete this item?',
  name: 'Item Name',
  callback: () => console.log('Deleted'),
  warning: 'This action cannot be undone.',
  isDelete: true,
}
