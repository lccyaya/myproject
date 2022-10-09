import Countdown from 'react-countdown';
import styles from './mobile.module.less';
import cls from 'classnames';
export default function Mobile({ diff = 0, onComplete = () => {}, className = null }) {
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    const allHours = days * 24 + hours;
    if (completed) {
      return null;
    } else {
      return (
        <div className={cls(styles.count_down, className)}>
          <span className={styles.date}>{allHours < 10 ? `0${allHours}` : allHours}</span>
          <span className={styles.division}>:</span>
          <span className={styles.date}>{minutes < 10 ? `0${minutes}` : minutes}</span>
          <span className={styles.division}>:</span>
          <span className={styles.date}>{seconds < 10 ? `0${seconds}` : seconds}</span>
        </div>
      );
    }
  };
  const date = new Date().getTime() + diff * 1000;
  return <Countdown renderer={renderer} date={date} onComplete={onComplete} />;
}
