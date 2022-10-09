import styles from './mobile.module.less';
import cls from 'classnames';

export default function Tags({ list, style, className = '' }) {
  if (list.filter((e) => e).length === 0) {
    return null;
  }
  return (
    <div className={cls(styles.tags, className)} style={style}>
      {list.map((item, index) => {
        return item ? (
          <span className={styles['tag_' + index]} key={item}>
            {item}
          </span>
        ) : null;
      })}
    </div>
  );
}
