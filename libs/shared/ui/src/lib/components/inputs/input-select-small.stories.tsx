import React from 'react'
import { StoryFn } from '@storybook/react'
import { InputSelectSmall, InputSelectSmallProps } from '@beep/ui'

export default {
  title: 'Components/InputSelectSmall',
  component: InputSelectSmall,
}

const Template: StoryFn<InputSelectSmallProps> = (args) => (
  <InputSelectSmall {...args} />
)

export const Default = Template.bind({})
Default.args = {
  label: 'Small Select',
  name: 'smallSelect',
  items: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ],
}

export const Disabled = Template.bind({})
Disabled.args = {
  label: 'Disabled Small Select',
  name: 'smallSelectDisabled',
  items: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ],
  disabled: true,
}
