import styles from './hot-news.less';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import type { TopInfo } from '@/services/news';
import { fetchLatestInfo } from '@/services/news';
import { useHistory, FormattedMessage } from 'umi';
import { report } from '@/services/ad';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';
import { locale } from '@/app';
import { toShortLangCode } from '@/utils/utils';

export default function HotNews() {
  const history = useHistory();
  const [pinnedData, setPinnedData] = useState<TopInfo>();
  const [curPage, setCurPage] = useState(0);
  const [classifiedData, setClassifiedData] = useState<TopInfo[][]>([]);

  const handleData = (data: TopInfo[]) => {
    const processData = data.slice(1).reduce(
      (p, c) => {
        const lastLen = p[p.length - 1].length;
        if (lastLen < 2) {
          p[p.length - 1].push(c);
        } else {
          p.push([c]);
        }
        return p;
      },
      [[]] as TopInfo[][],
    );
    setPinnedData(data[0]);
    setClassifiedData(processData);
  };

  const getData = async () => {
    const res = await fetchLatestInfo({
      page: 1,
      size: 10,
    });
    if (res.success) {
      handleData(res.data);
    }
  };

  const handleSwitch = (type: 'prev' | 'next') => {
    if (type === 'prev') {
      if (curPage <= 0) return;
      setCurPage((p) => p - 1);
    } else {
      if (curPage >= classifiedData.length - 1) return;
      setCurPage((p) => p + 1);
    }
  };

  const handleClick = (id: number, index: number) => {
    report({
      cate: REPORT_CATE.home,
      action: REPORT_ACTION.version_a_hot_news_click,
      tag: `${index + 1}`,
    });
    const lang = toShortLangCode(locale.getLocale());
    history.push(`/${lang}/newsdetail/${id}`);
  };

  useEffect(() => {
    getData();
  }, []);

  if (!classifiedData.length) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.left}>
          <FormattedMessage id="key_hot_news" />
        </div>
        <div className={styles.right}>
          <LeftOutlined
            onClick={() => handleSwitch('prev')}
            className={`${styles.icon} ${curPage <= 0 ? styles.disabled : ''}`}
          />
          <RightOutlined
            onClick={() => handleSwitch('next')}
            className={`${styles.icon} ${
              curPage >= classifiedData.length - 1 ? styles.disabled : ''
            }`}
          />
        </div>
      </div>
      <div className={styles.body}>
        <div
          className={styles.pinned}
          style={{ backgroundImage: `url(${pinnedData!.cover_img_url})` }}
          onClick={() => handleClick(pinnedData!.id, 0)}
        >
          <div className={styles.titleWrapper}>
            <div className={styles.title}>{pinnedData!.title}</div>
          </div>
        </div>
        <div className={`${styles.seq} ${styles.urgent} ${styles.outside}`}>1</div>
        <div className={styles.listWrapper}>
          <div className={styles.list} style={{ transform: `translateX(${curPage * -100}%)` }}>
            {classifiedData.map((d, i) => {
              return (
                <div className={styles.col} key={`col-${d[0]?.id}`}>
                  {d.map((dd, j) => {
                    let seqCls = '';
                    if (i === 0 && j === 0) {
                      seqCls = styles.important;
                    } else if (i === 0 && j === 1) {
                      seqCls = styles.normal;
                    }
                    return (
                      <div
                        className={styles.item}
                        key={dd.id}
                        onClick={() => handleClick(dd.id, j + 1)}
                      >
                        <div className={`${styles.seq} ${seqCls}`}>{i * 2 + j + 2}</div>
                        {dd.title}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
