import { LoaderSpinner } from '@beep/ui'
import { StoryFn } from '@storybook/react'

export default {
  component: LoaderSpinner,
  title: 'Components/LoaderSpinner',
  argTypes: {
    theme: {
      options: ['dark', 'light'],
      control: { type: 'select' },
    },
  },
}

const Template: StoryFn<typeof LoaderSpinner> = (args) => (
  <LoaderSpinner {...args} />
)

export const Default = Template.bind({})

Default.args = {
  className: '',
  classWidth: 'w-16',
  classBorder: 'border-4',
  theme: 'light',
}
