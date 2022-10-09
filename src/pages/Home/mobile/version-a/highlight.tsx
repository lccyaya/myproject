import styles from './highlight.less';
import { RightOutlined } from '@ant-design/icons';
import { Link, FormattedMessage, useHistory } from 'umi';
import { useEffect, useRef, useState } from 'react';
import type { Highlight as HighlightType } from '@/services/match';
import { fetchLatestHighlight } from '@/services/highlight';
import { formatDuration, toShortLangCode } from '@/utils/utils';
import { report } from '@/services/ad';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';
import { locale } from '@/app';

const pageSize = 10;

export default function Highlight() {
  const history = useHistory();
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [data, setData] = useState<(HighlightType & { match_id: number })[]>([]);
  const [page, setPage] = useState(1);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const getData = async () => {
    if (loading) return;
    setLoading(true);
    const res = await fetchLatestHighlight(page, pageSize);
    if (res.success) {
      const reachLast = res.data.high_lights.length + data.length >= res.data.total;
      setData([...data, ...res.data.high_lights]);
      setDone(reachLast);
      if (!reachLast) {
        setPage((p) => p + 1);
      }
    }
    setLoading(false);
  };

  const handleScroll = () => {
    const reachRight =
      scrollerRef.current!.scrollLeft + scrollerRef.current!.clientWidth >=
      scrollerRef.current!.scrollWidth;
    if (reachRight && !done) {
      getData();
    }
  };

  const handleClick = (matchId: number, index: number) => {
    report({
      cate: REPORT_CATE.home,
      action: REPORT_ACTION.version_a_highlight_click,
      tag: `${index + 1}`,
    });
    const lang = toShortLangCode(locale.getLocale());
    history.push(`/${lang}/details/${matchId}`);
  };

  useEffect(() => {
    getData();
  }, []);

  if (!data.length) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.left}>
          <FormattedMessage id="key_latest_highlights" />
        </div>
        <div
          className={styles.right}
          onClick={() => {
            const lang = toShortLangCode(locale.getLocale());
            history.push(`/${lang}/highlight`);
          }}
        >
          <div className={styles.text}>
            <FormattedMessage id="key_more" />
          </div>
          <RightOutlined className={styles.icon} />
        </div>
      </div>
      <div className={styles.body} ref={scrollerRef} onScroll={handleScroll}>
        {data.map((d, i) => (
          <div
            key={d.ID}
            className={styles.item}
            style={{ backgroundImage: `url(${d.cover_img_url})` }}
            onClick={() => handleClick(d.match_id, i)}
          >
            <div className={styles.title}>{d.title}</div>
            <div className={styles.duration}>
              <div className={styles.icon} />
              <div className={styles.text}>{formatDuration(d.duration)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
