import React from 'react'
import { StoryFn } from '@storybook/react'
import { InputSearch, InputSearchProps } from '@beep/ui'

export default {
  title: 'Components/InputSearch',
  component: InputSearch,
}

const Template: StoryFn<InputSearchProps> = (args) => <InputSearch {...args} />

export const Default = Template.bind({})
Default.args = {
  placeholder: 'Search...',
}

export const Empty = Template.bind({})
Empty.args = {
  placeholder: 'Search...',
  isEmpty: true,
  emptyContent: <p>No results found</p>,
}
