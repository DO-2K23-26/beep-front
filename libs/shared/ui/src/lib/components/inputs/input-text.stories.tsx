import { StoryFn } from '@storybook/react'
import { InputText, InputTextProps } from './input-text'

export default {
  title: 'Components/InputText',
  component: InputText,
}

const Template: StoryFn<InputTextProps> = (args) => <InputText {...args} />

export const Default = Template.bind({})
Default.args = {
  name: 'input',
  label: 'Input label',
}

export const WithValue = Template.bind({})
WithValue.args = {
  name: 'input',
  label: 'Input label',
  value: 'Hello world',
}

export const PasswordInput = Template.bind({})
PasswordInput.args = {
  name: 'password',
  label: 'Password',
  type: 'password',
}

export const Disabled = Template.bind({})
Disabled.args = {
  name: 'disabled',
  label: 'Disabled input',
  disabled: true,
}
