import { TooltipProvider } from '@radix-ui/react-tooltip'
import '../src/lib/styles/main.scss'
import { Preview } from '@storybook/react';
import { MemoryRouter } from 'react-router';

const preview: Preview = {
  globalTypes: {
    darkMode: {
      defaultValue: false
    }
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <TooltipProvider>
          <Story />
        </TooltipProvider>
      </MemoryRouter>
    )
  ]
}

export default preview
