import { Navigate, Route, Routes } from 'react-router'
import { ROUTER } from './router.main'
import { match } from 'ts-pattern'
import React from 'react'

export default function App() {
  return (
    <div>
      <Routes>
        {ROUTER.map((route, index) => (
          <React.Fragment key={index}>
            {match(route)
              .when(
                (r) => r.layout,
                (r) => (
                  <Route key={r.path} path={r.path} element={r.component} />
                )
              )
              .otherwise((r) => (
                <Route key={r.path} path={r.path} element={r.component} />
              ))}
          </React.Fragment>
        ))}
        <Route path="*" element={<Navigate to="/channels/@me" />} />
      </Routes>
    </div>
  )
}
