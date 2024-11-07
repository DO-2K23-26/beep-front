import { Subscription, Transmit } from '@adonisjs/transmit-client';
import { backendUrl } from '@beep/contracts';

export class TransmitSingleton {
  private static instance: Transmit
  private static readonly subscriptions = new Map<string, Subscription>()
  private static readonly unsubscribe = new Map<
    string,
    (() => void) | undefined
  >()

  // Private constructor to prevent direct instantiation
  private constructor() {
    TransmitSingleton.instance = new Transmit({
      baseUrl: backendUrl,
    })
  }

  // Method to get the singleton instance of Transmit
  public static getInstance(): Transmit {
    if (!TransmitSingleton.instance) {
      TransmitSingleton.instance = new Transmit({
        baseUrl: backendUrl,
        uidGenerator: () => {
          return Math.random().toString(36).substring(7)
        },
      })
    }
    return TransmitSingleton.instance
  }

  // Method to subscribe to a channel with a callback
  public static subscribe(channel: string, callback: (data: string) => void) {
    let subscription = TransmitSingleton.subscriptions.get(channel)

    if (!subscription) {
      subscription = TransmitSingleton.getInstance().subscription(channel)
      subscription.create()
      TransmitSingleton.subscriptions.set(channel, subscription)
    }

    const previousUnsubscribe = TransmitSingleton.unsubscribe.get(channel)
    if (previousUnsubscribe) {
      previousUnsubscribe() // Unsubscribe from previous message handler
    }

    const onMessageUnsubscribe = subscription.onMessage(callback)

    TransmitSingleton.unsubscribe.set(channel, onMessageUnsubscribe)
  }

  // Method to unsubscribe from a channel
  public static unsubscribeChannel(channel: string) {
    TransmitSingleton.subscriptions.delete(channel)
    TransmitSingleton.unsubscribe.get(channel)?.()
    TransmitSingleton.unsubscribe.delete(channel)
  }
}
