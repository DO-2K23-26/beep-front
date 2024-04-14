import { Navigate, Route, Routes } from 'react-router'
import { ROUTER } from './router.main'
import { match } from 'ts-pattern'

export default function App() {
  return (
    <div>
      <Routes>
        {ROUTER.map((route) =>
          match(route)
            .when((r) => r.layout, (r) => (
              <Route

              />
            ))
            .otherwise((r) => (
              <Route
                key={r.path}
                path={r.path}
                element={r.component}
              />
            ))
        )}
        <Route path="*" element={<Navigate to="/channels/@me" />} />
      </Routes>
    </div>
  )
}

