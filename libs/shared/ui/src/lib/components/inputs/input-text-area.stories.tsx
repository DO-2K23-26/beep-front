import { StoryFn } from '@storybook/react'
import { InputTextArea, InputTextAreaProps } from './input-text-area'

export default {
  title: 'Components/InputTextArea',
  component: InputTextArea,
}

const Template: StoryFn<InputTextAreaProps> = (args) => (
  <InputTextArea {...args} />
)

export const Default = Template.bind({})
Default.args = {
  name: 'textarea',
  label: 'Text area label',
}

export const WithValue = Template.bind({})
WithValue.args = {
  name: 'textarea',
  label: 'Text area label',
  value: 'Hello world',
}

export const Disabled = Template.bind({})
Disabled.args = {
  name: 'disabled',
  label: 'Disabled text area',
  disabled: true,
}

export const WithError = Template.bind({})
WithError.args = {
  name: 'error',
  label: 'Text area with error',
  error: 'This field is required',
}
