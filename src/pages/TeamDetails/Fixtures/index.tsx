import React from 'react';
import classnames from 'classnames';
import { Row, Col } from 'antd';
import moment from 'moment';
import { Link } from 'umi';
import type { matchType } from '@/services/matchPage';
import styles from './index.less';
import emptyLogo from '@/assets/emptyLogo.png';
import Empty from '@/components/Empty';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';

export type dataType = {
    date: string;
    matches: matchType[];
}

export type fixtureProps = {
    data: dataType[];
}


const Fixtures: React.FC<fixtureProps> = (props) => {
    const { data } = props;
    const lang = toShortLangCode(locale.getLocale());

    return (
        data && data.length > 0 ? <div className={styles.matchContainer}>
            {data.map((ele: dataType) => {
                return <div className={styles.row} key={ele.date}>
                    <div className={styles.date}>
                        <span className={styles.date}>{`${moment(new Date(+ele.date)).format(
                            'DD',
                        )}/`}</span>
                        <span className={styles.month}>{moment(new Date(+ele.date)).format('MM')}</span>
                    </div>
                    <div className={styles.content}>
                        {ele.matches.map((each: matchType) => {
                            return <Link className={styles.link} to={`/${lang}/details/${each.match_id}`} key={each.match_id}>
                                <Row className={styles.match}>
                                    <Col span={2} className={styles.time}>{moment(new Date(each.match_time * 1000)).format('HH:mm')}</Col>
                                    <Col span={10} className={styles.home}>
                                        <div className={classnames(styles.text, styles.homeText)}>
                                            <span className={styles.innerText}>{each.home_team_name}</span>
                                        </div>
                                        <img className={styles.logo} src={each.home_team_logo || emptyLogo} />
                                    </Col>
                                    <Col span={2} className={styles.vs}>vs</Col>
                                    <Col span={10} className={styles.away}>
                                        <img className={styles.logo} src={each.away_team_logo || emptyLogo} />
                                        <div className={styles.text}>
                                            <span className={styles.innerText}>{each.away_team_name}</span>
                                        </div>
                                    </Col>
                                </Row>
                            </Link>
                        })}
                    </div>
                </div>
            })}
        </div>
            : <Empty />
    );
};

export default Fixtures;
