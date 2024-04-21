import { StoryFn } from '@storybook/react'
import { Badge, BadgeProps, BadgeType } from './badge'

export default {
  component: Badge,
  title: 'Components/Badge',
}

const Template: StoryFn<BadgeProps> = (args) => <Badge {...args} />

export const Default = Template.bind({})

Default.args = {
  title: 'Rapidement',
  type: BadgeType.DANGER,
}
