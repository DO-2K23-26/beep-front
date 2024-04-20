import { StoryFn } from '@storybook/react'
import { Badge, BadgeProps, BadgeType } from './badge'
import React from 'react'

export default {
  component: Badge,
  title: 'Badge',
}

const Template: StoryFn<BadgeProps> = (args) => <Badge {...args} />

export const Primary = Template.bind({})

Primary.args = {
  title: 'Rapidement',
  type: BadgeType.DANGER,
}
