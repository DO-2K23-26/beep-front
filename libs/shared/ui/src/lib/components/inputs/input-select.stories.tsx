import React from 'react'
import { StoryFn } from '@storybook/react'
import { InputSelect, InputSelectProps } from '@beep/ui'

export default {
  title: 'Components/InputSelect',
  component: InputSelect,
}

const Template: StoryFn<InputSelectProps> = (args) => <InputSelect {...args} />

export const Default = Template.bind({})
Default.args = {
  label: 'Select',
  options: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ],
}

export const Disabled = Template.bind({})
Disabled.args = {
  label: 'Disabled Select',
  options: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ],
  disabled: true,
}

export const WithError = Template.bind({})
WithError.args = {
  label: 'Select with error',
  options: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ],
  error: 'This field is required',
}
