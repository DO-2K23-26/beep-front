import { StoryFn } from '@storybook/react'
import { Input, InputProps } from './input'

export default {
  title: 'Components/Input',
  component: Input,
}

const Template: StoryFn<InputProps> = (args) => <Input {...args} />

export const Default = Template.bind({})
Default.args = {
  type: 'text',
  placeholder: 'Enter text...',
  disabled: false,
}
