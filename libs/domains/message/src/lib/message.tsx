import styles from './message.module.scss'

/* eslint-disable-next-line */
export interface MessageProps {}

export function Message(props: MessageProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Message!</h1>
    </div>
  )
}

export default Message
