import { StoryFn } from '@storybook/react'
import { Menu } from './menu'
import { Button, Icon } from '@beep/ui'

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
          onClick: () => console.log('Item 1 clicked'),
        },
        {
          name: 'Redux & RTK',
          link: { url: 'https://redux.js.org/usage/', external: true },
          contentLeft: <Icon name="fontisto:redux" />,
          onClick: () => console.log('Item 2 clicked'),
        },
        // Ajoutez d'autres éléments de menu au besoin
      ],
      label: 'Menu 1',
    },
  ],
}
