import { Meta, Story } from '@storybook/react'
import { Icon } from './icon'

const meta: Meta<typeof Icon> = {
  component: Icon,
  title: 'Icon',
}

export default meta

export const Primary: Story = {
  args: {
    name: 'logos:adonisjs'
  }
}
