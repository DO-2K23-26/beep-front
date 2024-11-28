import { setupStore } from '@beep/store'
import { ModalProvider } from '@beep/ui'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import i18n from './i18n'
import { RouterProvider } from 'react-router'
import { router } from './app/router.main'

const container =
  document.getElementById('root') || document.createElement('div')
const root = createRoot(container)

const store = setupStore()

root.render(
  <StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <TooltipProvider>
          <ModalProvider>
            <RouterProvider router={router} />
          </ModalProvider>
        </TooltipProvider>
      </I18nextProvider>
    </Provider>
  </StrictMode>
)
