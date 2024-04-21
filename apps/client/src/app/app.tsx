import { Layout } from '@beep/pages/layout'
import { Navigate, Route, Routes } from 'react-router-dom'
import { match } from 'ts-pattern'
import { ROUTER } from './router.main'
import { Toaster } from 'react-hot-toast'

export default function App() {
  return (
    <div>
      <Toaster />
      <Routes>
        {ROUTER.map((route) =>
          match(route)
            .when(
              (r) => r.layout,
              (r) => (
                <Route
                  key={r.path}
                  path={r.path}
                  element={<Layout>{r.component}</Layout>}
                />
              )
            )
            .otherwise((r) => (
              <Route key={r.path} path={r.path} element={r.component} />
            ))
        )}
        <Route path="*" element={<Navigate to="/channels/@me" />} />
      </Routes>
    </div>
  )
}
