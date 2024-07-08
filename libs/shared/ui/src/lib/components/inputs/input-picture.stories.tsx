import { StoryFn } from '@storybook/react'
import { InputPicture, InputPictureProps } from './input-picture'

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
}
