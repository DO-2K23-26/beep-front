import { LoaderSpinner } from './loader-spinner';
import { StoryFn } from '@storybook/react';

export default {
  component: LoaderSpinner,
  title: 'LoaderSpinner',
  argTypes: {
    theme: {
      options: ['dark', 'light'],
      control: { type: 'select' },
    },
  },
};

const Template: StoryFn<typeof LoaderSpinner> = (args) => (
  <LoaderSpinner {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  className: '',
  classWidth: 'w-16',
  classBorder: 'border-4',
  theme: 'light',
};
