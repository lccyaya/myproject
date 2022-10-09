import React, { ReactNode, useRef, useState } from 'react';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';
import { Carousel as CarouselComponent } from 'antd';
import MajorMatchCard from '../MajorMatchCard';
import styles from './index.less';
import type { matchType } from '@/services/matchPage';
import type { REPORT_CATE } from '@/constants';
import { checkIsPhone } from '@/utils/utils';
import type { CarouselRef } from 'antd/es/carousel';
import { tipsType } from '@/services/home';

const group = (array: matchType[], subGroupLength: number) => {
  let index = 0;
  const newArray = [];
  while (index < array.length) {
    newArray.push(array.slice(index, (index += subGroupLength)));
  }
  return newArray;
};

export type CarouselProps = {
  data: matchType[];
  handleChangeLiveMatch: (id: number) => void;
  setParams: (id: number, bool: boolean) => void;
  isPhone: boolean;
  reportCate?: REPORT_CATE;
  hideOdds?: boolean;
  autoPlay?: boolean;
  columns?: number;
  customDots?: (r: CarouselRef | null, pages: number, index: number) => ReactNode;
  tipsData?: tipsType[];
};

const Carousel: React.FC<CarouselProps> = (props) => {
  const [index, setIndex] = useState(0);
  let countPerScreen = 1;
  if (!checkIsPhone()) {
    countPerScreen = props.columns ?? 3;
  }
  const result = group(props.data, countPerScreen);
  let width = 100;
  if (countPerScreen > 1) {
    // 每个item左边距2%，除了第一个
    width = (100 - (countPerScreen - 1) * 2) / countPerScreen;
  }
  const ref = useRef<CarouselRef | null>(null);
  return (
    <div className={styles.container}>
      <div className={styles.slideWrapper}>
        <div className={styles.slideScroller}>
          <CarouselComponent
            ref={ref}
            autoplay={props.autoPlay ?? true}
            autoplaySpeed={5000}
            dots={props.customDots ? false : { className: styles.dots }}
            className={styles.dot}
            beforeChange={(_, to) => setIndex(to)}
          >
            {result.map((matches, i) => {
              const key = `matches${i}`;
              return (
                <div className={styles.cardContainer} key={key}>
                  {matches.map((ele, j) => {
                    const key2 = `matches${j}`;
                    const tips = props.tipsData?.find((t) => t.match_id === ele.match_id);
                    return (
                      <MajorMatchCard
                        hideOdds={props.hideOdds}
                        reportCate={props.reportCate}
                        reportTag={j}
                        key={key2}
                        data={ele}
                        tips={tips}
                        handleChangeLiveMatch={props.handleChangeLiveMatch}
                        setParams={props.setParams}
                        style={{width: `${width}%`}}
                      />
                    );
                  })}
                </div>
              );
            })}
          </CarouselComponent>
        </div>
      </div>
      {props.customDots?.(ref.current, result.length, index)}
    </div>
  );
};
// export default Carousel;
export default connect(({ divice }: ConnectState) => ({
  isPhone: divice.isPhone,
}))(Carousel);
