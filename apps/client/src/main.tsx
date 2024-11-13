import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { setupStore } from '@beep/store'
import { ModalProvider } from '@beep/ui'
import { Provider } from 'react-redux'
import App from './app/app'
import { BrowserRouter } from 'react-router-dom'
import { TooltipProvider } from '@radix-ui/react-tooltip'

const container =
  document.getElementById('root') || document.createElement('div')
const root = createRoot(container)

const store = setupStore()

root.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <TooltipProvider>
          <ModalProvider>
            <App />
          </ModalProvider>
        </TooltipProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
)
