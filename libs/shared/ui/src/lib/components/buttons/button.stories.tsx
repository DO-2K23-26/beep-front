import { Button } from './button'
import { StoryFn } from '@storybook/react'

export default {
  component: Button,
  title: 'Components/Button',
}

const Template: StoryFn<typeof Button> = (args) => <Button {...args} />

export const Default = Template.bind({})

Default.args = {
  children: <p>Button</p>,
}
