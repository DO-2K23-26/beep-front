import { AppDispatch } from '@beep/store'
import { LoadingScreen } from '@beep/ui'
import { getUserState, userActions, useRefreshMutation } from '@beep/user'
import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'

export default function App() {
  const { isLoading, isAuthenticated, payload } = useSelector(getUserState)
  const dispatch = useDispatch<AppDispatch>()
  useState<NodeJS.Timeout>()
  const location = useLocation()
  const navigate = useNavigate()
  const [
    refresh,
    { data: refreshData, isError: isErrorRefresh, isSuccess: isSuccessRefresh },
  ] = useRefreshMutation()


  useEffect(() => {
    refresh()
    dispatch(userActions.updateIsLoading(false))
    setInterval(() => {
      refresh()
    }, 60 * 1000 * 12)
  }, [refresh, dispatch])

  useEffect(() => {
    if (isErrorRefresh) {
      navigate('/authentication/signin')
      return
    }
    if (isSuccessRefresh && refreshData) {
      dispatch(
        userActions.setTokens({
          accessToken: refreshData.accessToken,
          refreshToken: refreshData.refreshToken,
        })
      )
    }
  }, [dispatch, isErrorRefresh, isSuccessRefresh, navigate, refreshData])

  if (
    !isLoading &&
    !isAuthenticated &&
    !location.pathname.includes('authentication')
  ) {
    return (
      <Navigate
        to="/authentication/signin"
        replace
        state={{ from: location }}
      />
    )
  }

  if (isLoading && !location.pathname.includes('authentication')) {
    return <LoadingScreen />
  }

  if (
    payload &&
    !payload.audited_account &&
    !location.pathname.includes('authentication')
  ) {
    return <Navigate to={'/authentication/confirmation'} replace />
  }

  return (
    <>
      <Toaster />
      <Outlet />
    </>
  )
}
