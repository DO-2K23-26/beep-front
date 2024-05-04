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

export default function App() {
  const { tokens, isLoading, isAuthenticated, payload } =
    useSelector(getUserState)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [tokenRefreshInterval, setTokenRefreshInterval] =
    useState<NodeJS.Timeout>()
  const [refresh, result] = useRefreshMutation()
  const { pathname } = useLocation()

  useEffect(() => {
    if (tokens.refreshToken && tokens.accessToken) {
      console.log('interval set')
      const interval = setInterval(checkTokenValidityAndRefresh, 5000)
      setTokenRefreshInterval(interval)
    }
  }, [tokens])

  async function checkTokenValidityAndRefresh() {
    if (tokens.accessToken && tokens.refreshToken) {
      const payload = tokens.accessToken.split('.')[1]
      const data = atob(payload)
      const result = JSON.parse(data)
      const tokenExpiration = new Date(result.exp * 1000)

      const currentTime = new Date()
      if (tokenExpiration < currentTime) {
        try {
          refresh(tokens.refreshToken)
        } catch (e) {
          console.error(e)
          sessionStorage.removeItem('accessToken')
          sessionStorage.removeItem('refreshToken')
        }
      }
    }
  }

  useEffect(() => {
    console.log('getting result')
    if (result) {
      if (!result.isLoading && result.data) {
        console.log('result success')
        dispatch(userActions.updateIsAuthentificated(true))
        dispatch(userActions.setTokens(result.data))
        sessionStorage.setItem('accessToken', result.data.accessToken)
        sessionStorage.setItem('refreshToken', result.data.refreshToken)
      }

      if (result.isError) {
        console.log('result error')

        sessionStorage.removeItem('accessToken')
        sessionStorage.removeItem('refreshToken')
        dispatch(userActions.updateIsAuthentificated(false))
        dispatch(userActions.setTokens({}))
        navigate('/authentication/signin')
      }
    }
  }, [result])

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken')
    const refreshToken = sessionStorage.getItem('refreshToken')
    if (accessToken && refreshToken) {
      dispatch(userActions.setTokens({ accessToken, refreshToken }))
    }
  }, [])

  if (!isAuthenticated && !pathname.includes('authentication')) {
    return <Navigate to={'/authentication/signin'} replace />
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
