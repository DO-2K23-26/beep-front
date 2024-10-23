import { Subscription, Transmit } from '@adonisjs/transmit-client'
import { backendUrl, Token } from '@beep/contracts'
import { jwtDecode } from 'jwt-decode'

export class TransmitSingleton {
  private static instance: Transmit
  private static subscriptions = new Map<string, Subscription>()
  private static unsubscribe = new Map<string, (() => void) | undefined>()

  private constructor() {
    TransmitSingleton.instance = new Transmit({
      baseUrl: backendUrl,
    })
  }

  public static getInstance(): Transmit {
    if (!TransmitSingleton.instance) {
      const token = sessionStorage.getItem('accessToken')
      const decoded = jwtDecode<Token>(token ?? '')
      TransmitSingleton.instance = new Transmit({
        uidGenerator: () => decoded.sub,
        baseUrl: backendUrl,
        beforeSubscribe(request) {
          if (request.headers)
            // This type error is a bug in the library
            // Don't mind sending a PR to transmit-client to fix it
            request.headers.append('authorization', `Bearer ${token}`)
        },
      })
    }
    return TransmitSingleton.instance
  }

  public static subscribe(channel: string, callback: (data: any) => void) {
    if (!TransmitSingleton.subscriptions.get(channel)) {
      const subscription = TransmitSingleton.getInstance().subscription(channel)
      subscription.create()
      TransmitSingleton.subscriptions.set(channel, subscription)
    }
    if (TransmitSingleton.unsubscribe.get(channel))
      TransmitSingleton.unsubscribe.get(channel)?.()
    TransmitSingleton.unsubscribe.set(
      channel,
      TransmitSingleton.subscriptions.get(channel)?.onMessage(callback)
    )
  }

  public static unsubscribeChannel(channel: string) {
    TransmitSingleton.subscriptions.delete(channel)
    TransmitSingleton.unsubscribe.get(channel)?.()
    TransmitSingleton.unsubscribe.delete(channel)
  }
}
