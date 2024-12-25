import { AppDispatch } from '@beep/store'
import { LoadingScreen } from '@beep/ui'
import { getUserState, userActions, useRefreshMutation } from '@beep/user'
import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { TransmitSingleton, upperCaseFirstLetter } from '@beep/utils'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { logger } from 'nx/src/utils/logger'

export default function App() {
  const { t } = useTranslation()
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

  useEffect(() => {
    subscribeToNotifs(payload)
  }, [payload])

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

  function subscribeToNotifs(payload: any) {
    if (payload) {
      TransmitSingleton.subscribe(
        `notifications/users/${payload.sub}`,
        (data) => {
          try {
            if (typeof data === 'object' &&
              data !== null &&
              'event' in data) {
              const outerData = data as { event: string}
              if (outerData.event.trim().startsWith('{') &&
                outerData.event.trim().endsWith('}')) {
                const parsedMessage = JSON.parse(outerData.event)
                switch (parsedMessage.type) {
                  case 'USER_MENTIONED_IN_MESSAGE':
                    toast(
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div>
                          <strong>
                            {upperCaseFirstLetter(parsedMessage.serverName)} :{' '}
                            {upperCaseFirstLetter(parsedMessage.channelName)}
                          </strong>
                          <div>
                            {upperCaseFirstLetter(parsedMessage.senderName)}{' '}
                            {t('notifications.mentions.mentioned')}
                          </div>
                        </div>
                      </div>,
                      {
                        icon: '🔔',
                      }
                    )
                    break
                  case 'FRIEND_REQUEST':
                    toast(
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div>
                          <strong>
                            {upperCaseFirstLetter(parsedMessage.senderName)}
                          </strong>{t('notifications.friend-request.request')}
                        </div>
                      </div>,
                      {
                        icon: '🔔',
                      }
                    )
                    break
                  default:
                    break
                }
              } else {
                throw new Error('Invalid JSON data in message field')
              }
            } else {
              throw new Error('Data does not contain a valid message field')
            }
          } catch (error) {
            logger.debug('Failed to parse JSON data:', error)
          }
        }
      )
    }
  }
}
