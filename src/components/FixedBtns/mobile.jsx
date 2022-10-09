import styles from './mobile.module.less';
import IconFont from '@/components/IconFont';
import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import FeedBack from '@/components/FeedBack/mobile';
import { history } from 'umi';
export default function FixedBtns({ showTopIcon, onTopClick = () => {} }) {
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const scroll = (e) => {
      const a = document.documentElement.scrollTop || document.body.scrollTop; //滚动条 y 轴上的距离
      if (a >= 100) {
        setShow(true);
      } else {
        setShow(false);
      }
    };
    window.addEventListener('scroll', scroll);
    return () => {
      window.removeEventListener('scroll', scroll);
    };
  }, []);
  const scrollToTop = () => {
    const c = document.documentElement.scrollTop || document.body.scrollTop;

    if (c > 0) {
      window.requestAnimationFrame(scrollToTop);
      window.scrollTo(0, c - c / 8);
    }
  };

  const pathname = history?.location?.pathname;

  const notMatchPage = pathname?.indexOf('/match') === -1 && pathname?.indexOf('/live') === -1;
  return (
    <div>
      <CSSTransition timeout={300} in={show || showTopIcon} classNames="fade" unmountOnExit>
        <div className={styles.wrapper}>
          <div
            className={styles.back}
            onClick={(e) => {
              onTopClick(e);
              scrollToTop();
            }}
          >
            <div className={styles.sidebar_item}>
              <IconFont className={styles.icon} type="icon-huidingbu" size={22} />
            </div>
            { notMatchPage ? <div
              className={styles.sidebar_item}
              onClick={(e) => {
                e.stopPropagation();
                setVisible(true);
              }}
            >
              <IconFont type="icon-yijianfankui" size={22} />
            </div> : null }
          </div>
        </div>
      </CSSTransition>
      <FeedBack visible={visible} setVisible={setVisible} />
    </div>
  );
}
