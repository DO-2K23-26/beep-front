import { Subscription, Transmit } from '@adonisjs/transmit-client'
import { backendUrl } from '@beep/contracts'

export class TransmitSingleton {
    private static instance: Transmit;
    private static subscriptions = new Map<string, Subscription>();
    private static unsubscribe = new Map<string, (() => void)|undefined>();

    private constructor() {
        TransmitSingleton.instance = new Transmit({
            baseUrl: backendUrl,
        });
        
    }
    
    public static getInstance(): Transmit {
        if (!TransmitSingleton.instance) {
            
            TransmitSingleton.instance = new Transmit({
                baseUrl: backendUrl,
              });
        } 
        return TransmitSingleton.instance;
    }

    public static getSubscription(channel: string) : Subscription | undefined {
        if (!TransmitSingleton.subscriptions.get(channel)) {
            const subscription = TransmitSingleton.getInstance().subscription(channel);
            subscription.create();
            TransmitSingleton.subscriptions.set(channel, subscription);
        }
        return TransmitSingleton.subscriptions.get(channel);
    }

    public static getUnsubscribe(channel: string): (() => void) | undefined {
        return TransmitSingleton.unsubscribe.get(channel);
    }

    public static setUnsubscribe(channel: string, unsubscribe: (() => void) | undefined) {
        TransmitSingleton.unsubscribe.set(channel, unsubscribe);
    }

}