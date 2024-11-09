import { Subscription, Transmit } from '@adonisjs/transmit-client'
import { backendUrl } from '@beep/contracts'

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
      TransmitSingleton.instance = new Transmit({
        baseUrl: backendUrl,
      })
    }
    return TransmitSingleton.instance
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
