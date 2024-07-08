import { StoryFn } from '@storybook/react'
import { Menu } from './menu'
import { Button } from '../buttons/button'
import { Icon } from '../icons/icon'

export default {
  component: Menu,
  title: 'Components/Menu',
}

const Template: StoryFn<typeof Menu> = (args) => <Menu {...args} />

export const Default = Template.bind({})

Default.args = {
  trigger: <Button>Trigger</Button>,
  menus: [
    {
      items: [
        {
          name: 'React',
          link: { url: 'https://fr.react.dev/', external: true },
          contentLeft: <Icon name="fontisto:react" />,
        },
        {
          name: 'Redux & RTK',
          link: { url: 'https://redux.js.org/usage/', external: true },
          contentLeft: <Icon name="fontisto:redux" />,
        },
        // Ajoutez d'autres éléments de menu au besoin
      ],
      label: 'Menu 1',
    },
  ],
}
