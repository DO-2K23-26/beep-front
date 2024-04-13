import styles from './utils.module.scss';

/* eslint-disable-next-line */
export interface UtilsProps {}

export function Utils(props: UtilsProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Utils!</h1>
    </div>
  );
}

export default Utils;
