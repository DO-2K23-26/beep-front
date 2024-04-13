import styles from './contracts.module.scss';

/* eslint-disable-next-line */
export interface ContractsProps {}

export function Contracts(props: ContractsProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Contracts!</h1>
    </div>
  );
}

export default Contracts;
