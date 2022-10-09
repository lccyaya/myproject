import styles from './index.less';
import Empty from '@/components/Empty';
import { Button, Spin } from 'antd';
import cls from 'classnames';
import HitImage from '@/assets/hit.png';
import MissImage from '@/assets/miss.png';
import Tags from '@/components/Tags/pc';
import { toShortLangCode, formatMatchTime } from '@/utils/utils';
import { locale } from '@/app';
import { history } from 'umi';
import { PLAY_STATUS, SCHEME_STATE } from '@/constants/index';
import { formatTime } from '@/utils/utils';
import Avatar from '@/components/avatar';
import { handleReport } from '@/utils/report';
import moment from 'moment';

export default function SchemeList({
  showExpert = true,
  type,
  list = [],
  isWatch = false,
  showMatch = true,
  loading = false,
  eventTag,
  schemeType = '',
  showHitRate = true,
  showTags = true,
}) {
  return (
    <Spin spinning={loading}>
      <div className={styles.program_list}>
        {list.length > 0 ? (
          list.map((item) => {
            return (
              <div
                className={cls(styles.item, type === 'card' ? styles.card : null)}
                key={item.scheme_id}
                onClick={() => {
                  handleReport({
                    action: 'scheme_enter',
                    tag: ['all', 'rq', 'spf', 'sfgg', 'sxds'][item.play],
                  });
                  const lang = toShortLangCode(locale.getLocale());
                  history.push(`/${lang}/scheme?id=${item.scheme_id}&match_id=${item.match_id}`);
                }}
              >
                {showExpert ? (
                  <div className={styles.header}>
                    <div className={styles.avatar}>
                      <Avatar
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleReport({
                            action: 'expert_enter',
                            tag: eventTag,
                          });
                          const lang = toShortLangCode(locale.getLocale());
                          history.push(`/${lang}/expert-detail?id=${item.expert_id}`);
                        }}
                        src={item.avatar}
                        size={46}
                        className={styles.avatar_img}
                      />
                      <div className={styles.content}>
                        <div
                          className={styles.nickname}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            const lang = toShortLangCode(locale.getLocale());
                            history.push(`/${lang}/expert-detail?id=${item.expert_id}`);
                          }}
                        >
                          {item.nickname}
                        </div>
                        {showTags ? (
                          <Tags
                            list={[item.continuous_tag, item.hit_tag]}
                            className={styles.tags}
                          />
                        ) : null}
                      </div>
                    </div>

                    {showHitRate && item.hit_rate > 60 ? (
                      <div className={styles.hit_wrap}>
                        <div className={styles.hit}>
                          <span className={styles.hit_num}>{item.hit_rate}</span>
                          <span className={styles.symbol}>%</span>
                        </div>
                        <div className={styles.label}>命中率</div>
                      </div>
                    ) : null}
                    {schemeType === 'follow' ? (
                      <div className={styles.hit_status}>
                        {item.state === SCHEME_STATE.HIT ? <img src={HitImage} /> : null}
                        {item.state === SCHEME_STATE.MISS ? <img src={MissImage} /> : null}
                      </div>
                    ) : null}
                  </div>
                ) : null}
                <div className={styles.desc}>{item.describe || item.scheme_introduce}</div>
                {showMatch ? (
                  <div className={styles.match}>
                    <div className={styles.match_name}>
                      [<span>{item.competition_name}</span>]
                    </div>
                    <div className={styles.team_wrap}>
                      <span className={styles.team}>{item.home_name || item.home_team_name}</span>{' '}
                      VS
                      <span className={styles.team}>{item.away_name || item.away_team_name}</span>
                    </div>
                    <div className={styles.time}>{formatMatchTime(item.match_time)}</div>
                  </div>
                ) : null}
                {schemeType === 'follow' ? null : (
                  <div className={styles.footer}>
                    {schemeType === 'order' ? (
                      <>
                        <span className={styles.publish}>
                          {item.buy_time
                            ? `${moment(item.buy_time * 1000).format('YYYY-MM-DD HH:mm:ss')}购买`
                            : ''}
                          {item.is_refund ? <span className={styles.is_refund}>已退款</span> : null}
                        </span>
                        <span className={styles.type}>
                          {item.state === SCHEME_STATE.HIT ? <img src={HitImage} /> : null}
                          {item.state === SCHEME_STATE.MISS ? <img src={MissImage} /> : null}
                          <span className={styles.gold}>
                            {item.gold_coin === 0 ? '免费' : `${item.gold_coin} 金币`}
                          </span>
                        </span>
                      </>
                    ) : (
                      <>
                        <span className={styles.publish}>
                          {item.published_at ? `${formatTime(item.published_at)}发布` : ''}
                        </span>
                        <span className={styles.type}>
                          {item.state === SCHEME_STATE.HIT ? <img src={HitImage} /> : null}
                          {item.state === SCHEME_STATE.MISS ? <img src={MissImage} /> : null}
                          {PLAY_STATUS[item.play]}｜
                          {item.state === SCHEME_STATE.STOP_SALE ? (
                            <span className={styles.stop_sale}>停售</span>
                          ) : (
                            <span className={styles.gold}>
                              {item.gold_coin === 0 ? '免费' : `${item.gold_coin} 金币`}
                            </span>
                          )}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className={styles.empty_wrap}>
            {isWatch ? (
              <>
                <Empty message="暂无关注的专家" />
                <div className={styles.tips}>关注后，可在此第一时间了解专家方案</div>
                <Button
                  type="primary"
                  onClick={() => {
                    const lang = toShortLangCode(locale.getLocale());
                    history.push(`/${lang}/expert/rank`);
                  }}
                >
                  查看推荐专家
                </Button>
              </>
            ) : (
              <Empty />
            )}
          </div>
        )}
      </div>
    </Spin>
  );
}
