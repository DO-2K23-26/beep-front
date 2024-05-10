import { getUserState, useRefreshMutation, userActions } from '@beep/user'
import React, { useEffect, useState } from 'react'
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
import { LoadingScreen } from '@beep/ui'

export default function App() {
  const { tokens, isLoading, isAuthenticated, payload } = useSelector(getUserState)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [tokenRefreshInterval, setTokenRefreshInterval] =
    useState<NodeJS.Timeout>()
  const [refresh, result] = useRefreshMutation()
  const { pathname } = useLocation()

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken')
    const refreshToken = sessionStorage.getItem('refreshToken')

    if (accessToken && refreshToken) {
      dispatch(userActions.setTokens({accessToken, refreshToken}))
    }

    dispatch(userActions.updateIsLoading(false))
  }, [])

  useEffect(() => {
    if (tokens && tokens.refreshToken && tokens.accessToken) {
      const interval = setInterval(checkTokenValidityAndRefresh, 300000)
      setTokenRefreshInterval(interval)
    }

    return () => {
      if (tokenRefreshInterval) {
        clearInterval(tokenRefreshInterval)
      }

    }
  }, [tokens])

  async function checkTokenValidityAndRefresh() {
    if (tokens.accessToken && tokens.refreshToken) {
      const tokenExpiration = new Date(
        JSON.parse(atob(tokens.accessToken.split('.')[1])).exp * 1000
      )
      const currentTime = new Date()
      if (tokenExpiration < currentTime) {
        try {
          refresh({ refreshToken: tokens.refreshToken })
        } catch (e) {
          sessionStorage.removeItem('accessToken')
          sessionStorage.removeItem('refreshToken')
        }
      }
    }
  }

  useEffect(() => {
    if (result) {
      if (!result.isLoading && result.data) {
        dispatch(userActions.setTokens(result.data))
        sessionStorage.setItem('accessToken', result.data.accessToken)
        sessionStorage.setItem('refreshToken', result.data.refreshToken)
      }

      if (!result.isLoading && result.isError) {
        sessionStorage.removeItem('accessToken')
        sessionStorage.removeItem('refreshToken')

        dispatch(userActions.setTokens({}))
        navigate('/authentication/signin')
      }

    }
  }, [result])

  if (!isLoading && !isAuthenticated && !pathname.includes('authentication')) {
    return <Navigate to={'/authentication/signin'} replace />
  }

  if (isLoading && !pathname.includes('authentication')) {
    return (
      <LoadingScreen />
    )
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
