import { getUserState, useRefreshMutation, userActions } from '@beep/user'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Layout } from '@beep/pages/layout'
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { match } from 'ts-pattern'
import { ROUTER } from './router.main'
import { Toaster } from 'react-hot-toast'
import { AppDispatch } from '@beep/store'
import { LoadingScreen } from '@beep/ui'
import { backendUrl } from '@beep/contracts'

export default function App() {
  const { isLoading, isAuthenticated, payload } = useSelector(getUserState)
  const dispatch = useDispatch<AppDispatch>()
  useState<NodeJS.Timeout>()
  const { pathname } = useLocation()

  const refresh = useCallback(() => {
    fetch(backendUrl + '/authentication/refresh', {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json()
        } else {
          throw new Error('Failed to refresh token')
        }
      })
      .then((data) => {
        dispatch(
          userActions.setTokens({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          })
        )
      })
  }, [dispatch])

  useEffect(() => {
    refresh()
    dispatch(userActions.updateIsLoading(false))
    setInterval(() => {
      refresh()
    }, 60 * 1000 * 12)
  }, [refresh, dispatch])

  if (!isLoading && !isAuthenticated && !pathname.includes('authentication')) {
    return <Navigate to={'/authentication/signin'} replace />
  }

  if (isLoading && !pathname.includes('authentication')) {
    return <LoadingScreen />
  }

  if (
    payload &&
    !payload.audited_account &&
    !pathname.includes('authentication')
  ) {
    return <Navigate to={'/authentication/confirmation'} replace />
  }

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
                  element={
                    <Layout
                      rightPanel={r.layout?.rightPanel || undefined}
                      leftPanel={r.layout?.leftPanel || undefined}
                    >
                      {r.component}
                    </Layout>
                  }
                />
              )
            )
            .otherwise((r) => (
              <Route key={r.path} path={r.path} element={r.component} />
            ))
        )}
        <Route path="*" element={<Navigate to="/discover" />} />
      </Routes>
    </div>
  )
}
