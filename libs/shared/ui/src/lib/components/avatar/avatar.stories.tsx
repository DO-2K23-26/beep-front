import { StoryFn } from '@storybook/react';
import { Avatar, AvatarProps } from './avatar';

export default {
  component: Avatar,
  title: 'Avatar',
};

const Template: StoryFn<AvatarProps> = (args) => <Avatar {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  username: 'Nathalos',
};
