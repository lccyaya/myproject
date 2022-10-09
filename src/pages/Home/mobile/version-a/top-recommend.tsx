import SwiperCore, { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import 'swiper/swiper.min.css';
import styles from './top-recommend.less';
import { useEffect, useState } from 'react';
import type { TopInfo } from '@/services/news';
import { fetchTopInfo } from '@/services/news';
import { useHistory } from 'umi';
import { report } from '@/services/ad';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';

SwiperCore.use([Autoplay]);

export default function TopRecommend() {
  const history = useHistory();
  const [curIndex, setCurIndex] = useState(0);
  const [data, setData] = useState<TopInfo[]>([]);
  const getData = async () => {
    const res = await fetchTopInfo();
    if (res.success) {
      setData(res.data);
    }
  };
  const handleClick = (info: TopInfo) => {
    const path = info.type === 1 ? 'details' : 'newsdetail';
    report({
      cate: REPORT_CATE.home,
      action: REPORT_ACTION.version_a_home_recommend_banner_click,
      tag: `${curIndex + 1}`,
    });
    history.push(`./${path}/${info.id}`);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (data.length) {
      report({
        cate: REPORT_CATE.home,
        action: REPORT_ACTION.version_a_home_recommend_banner_display,
        tag: `${curIndex + 1}`,
      });
    }
  }, [curIndex, data]);

  if (!data.length) {
    return null;
  }
  return (
    <div className={styles.topRecommend}>
      <Swiper
        loop={data.length > 1}
        spaceBetween={8}
        centeredSlides
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        slidesPerView={'auto'}
        onSlideChange={(swiper) => setCurIndex(swiper.activeIndex % data.length)}
      >
        {data.map((s) => (
          <SwiperSlide key={s.id}>
            <div
              onClick={() => handleClick(s)}
              key={s.id}
              className={styles.slide}
              style={{ backgroundImage: `url(${s.cover_img_url})` }}
            >
              {s.type === 1 && <div className={styles.videoIcon} />}
              <div className={styles.title}>
                <div className={styles.titleWrapper}>{s.title}</div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className={styles.indicator}>
        {data.map((_, i) => (
          <div key={i} className={`${styles.item} ${i === curIndex ? styles.active : ''}`} />
        ))}
      </div>
    </div>
  );
}
