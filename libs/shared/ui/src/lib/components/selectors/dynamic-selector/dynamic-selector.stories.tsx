import { StoryFn } from '@storybook/react'
import { DynamicSelector } from './dynamic-selector'
import { BadgeProps } from '../../badge/badge'

export default {
  component: DynamicSelector,
  title: 'Components/DynamicSelector',
}

const Template: StoryFn<BadgeProps> = (args) => <DynamicSelector {...args} />

export const Default = Template.bind({})

Default.args = {
  title: 'Rapidement',
  type: BadgeType.DANGER,
}
