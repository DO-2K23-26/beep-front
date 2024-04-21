import React from 'react'
import { StoryFn } from '@storybook/react'
import { InputRadioBox, InputRadioBoxProps } from '@beep/ui'

export default {
  title: 'Components/InputRadioBox',
  component: InputRadioBox,
}

const Template: StoryFn<InputRadioBoxProps> = (args) => (
  <InputRadioBox {...args} />
)

export const Default = Template.bind({})
Default.args = {
  name: 'radioGroup',
  label: 'Option 1',
  value: 'option1',
  fieldValue: '',
}

export const Selected = Template.bind({})
Selected.args = {
  name: 'radioGroup',
  label: 'Option 2',
  value: 'option2',
  fieldValue: 'option2',
}

export const WithDescription = Template.bind({})
WithDescription.args = {
  name: 'radioGroup',
  label: 'Option 3',
  value: 'option3',
  fieldValue: '',
  description: 'Description for Option 3',
}
