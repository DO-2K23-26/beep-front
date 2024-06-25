import { InputPicture, InputPictureProps } from '@beep/ui'
import { StoryFn } from '@storybook/react'

export default {
  title: 'Components/InputPicture',
  component: InputPicture,
}
const Template: StoryFn<InputPictureProps> = (args) => (
  <InputPicture {...args} />
)

export const Default = Template.bind({})
Default.args = {
  label: 'InputPicture label',
  name: 'test',
}
