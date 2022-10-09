import { Pagination } from 'antd';
import styles from './index.module.less';
export default function BasePagination({
  onChange = () => {},
  onShowSizeChange = () => {},
  showQuickJumper = true,
  current,
  total,
  size = 20,
  showSizeChanger = false,
  hideOnSinglePage = true,
}) {
  return (
    <div className={styles.pagination}>
      <Pagination
        current={current}
        onChange={onChange}
        pageSize={size}
        showQuickJumper={showQuickJumper}
        total={total}
        showSizeChanger={showSizeChanger}
        onShowSizeChange={onShowSizeChange}
        hideOnSinglePage={hideOnSinglePage}
      />
    </div>
  );
}
