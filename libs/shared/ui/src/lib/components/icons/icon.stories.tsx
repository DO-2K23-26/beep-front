import { StoryFn } from '@storybook/react';
import { Icon } from './icon';

export default {
  component: Icon,
  title: 'Components/Icon',
};

const Template: StoryFn<typeof Icon> = (args) => <Icon {...args} />;

export const Default = Template.bind({});

Default.args = {
  name: 'logos:adonisjs',
};
