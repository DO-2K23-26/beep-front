import { StoryFn } from '@storybook/react';
import { Icon } from './icon';

export default {
  component: Icon,
  title: 'Icon',
};

const Template: StoryFn<typeof Icon> = (args) => <Icon {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  name: 'logos:adonisjs',
};
