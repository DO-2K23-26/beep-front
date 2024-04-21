import React from 'react';
import { StoryFn } from '@storybook/react';
import { InputRadio, InputRadioProps } from '@beep/ui';

export default {
  title: 'Components/InputRadio',
  component: InputRadio,
};

const Template: StoryFn<InputRadioProps> = (args) => <InputRadio {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: 'radioGroup',
  label: 'Option 1',
  value: 'option1',
};

export const Checked = Template.bind({});
Checked.args = {
  name: 'radioGroup',
  label: 'Option 2',
  value: 'option2',
  isChecked: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  name: 'radioGroup',
  label: 'Option 3',
  value: 'option3',
  disable: true,
};

export const WithDescription = Template.bind({});
WithDescription.args = {
  name: 'radioGroup',
  label: 'Option 4',
  value: 'option4',
  description: 'Description for Option 4',
};

export const BigLabel = Template.bind({});
BigLabel.args = {
  name: 'radioGroup',
  label: 'Option 5',
  value: 'option5',
  big: true,
};
