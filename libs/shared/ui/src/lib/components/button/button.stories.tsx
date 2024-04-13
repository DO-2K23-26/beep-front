import { Button } from './button';
import { StoryFn } from '@storybook/react';

export default {
  component: Button,
  title: 'Button',
};

const Template: StoryFn<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  children: <p>Button</p>,
};
