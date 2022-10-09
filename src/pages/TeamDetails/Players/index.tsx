import React from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';
import empty from '@/assets/icon/avatar.svg';
import type { teamPlayersType, playerType, coachType } from '@/services/matchPage';
import Empty from '@/components/Empty';
import {useIntl} from 'umi'

type playerProps = {
    data: teamPlayersType
}

const Players: React.FC<playerProps> = (props) => {
    const intl = useIntl()
    const {
        data: {
            coach, squad
        }
    } = props;

    const attaker = squad.filter((ele: playerType) => {
        return ele.position === 'F';
    })
    const midfielder = squad.filter((ele: playerType) => {
        return ele.position === 'M';
    })
    const defender = squad.filter((ele: playerType) => {
        return ele.position === 'D';
    })
    const goalkeeper = squad.filter((ele: playerType) => {
        return ele.position === 'G';
    })
    const others = squad.filter((ele: playerType) => {
        return ele.position !== 'F' && ele.position !== 'M' && ele.position !== 'D' && ele.position !== 'G';
    })

    const drawPlayer = (type: string, d: playerType[]) => {
        return <div className={styles.player}>
            <Row className={styles.head}>
                <Col className={styles.title} span={12}>{type}</Col>
                <Col className={styles.intro} span={3}>
                    {intl.formatMessage({ id: 'key_apps' })}
                </Col>
                <Col className={styles.intro} span={3}>
                    {intl.formatMessage({ id: 'key_goals' })}
                </Col>
                <Col className={styles.intro} span={3}>
                    {intl.formatMessage({ id: 'key_assists' })}
                </Col>
                <Col className={styles.intro} span={3}>€/W</Col>
            </Row>
            {d.map((ele: playerType) => {
                return <Row className={styles.card} key={ele.name}>
                    <Col className={styles.leftCon} span={12}>
                        <div className={styles.left}>
                            <img className={styles.logo} src={ele.logo || empty} />
                            <div className={styles.textContent}>
                                <div className={styles.name}>{ele.name}</div>
                                <div className={styles.info}>{`${intl.formatMessage({ id: 'key_age' })} ${ele.age || '-'}·${intl.formatMessage({ id: 'No.' })} ${ele.shirt_number || '-'}·${ele.nationality || '-'}`}</div>
                            </div>
                        </div>
                    </Col>
                    <Col className={styles.labelCon} span={3}>
                        <div className={styles.label}>{ele.matches || '-'}</div>
                    </Col>
                    <Col className={styles.labelCon} span={3}>
                        <div className={styles.label}>{ele.goals || '-'}</div>
                    </Col>
                    <Col className={styles.labelCon} span={3}>
                        <div className={styles.label}>{ele.assists || '-'}</div>
                    </Col>
                    <Col className={styles.labelCon} span={3}>
                        <div className={styles.label}>{ele.mkt_val ? `${ele.mkt_val / 1000}k` : '-'}</div>
                    </Col>
                </Row>
            })}
        </div>
    }
    return (
        squad && squad.length ?
            <div className={styles.playerContainer}>
                {coach && <div className={styles.coach}>
                    <div className={styles.title}>
                     {intl.formatMessage({ id: 'key_coach' })}
                    </div>
                    <div className={styles.content}>
                        {coach.map((ele: coachType) => {
                            return <div className={styles.cardCon} key={ele.name}>
                                <div className={styles.card}>
                                    <img className={styles.logo} src={ele.logo || empty} />
                                    <div className={styles.textContent}>
                                        <div className={styles.name}>{ele.name}</div>
                                        <div className={styles.info}>{`${intl.formatMessage({ id: 'key_age' })} ${ele.age || '-'}·${ele.nationality || '-'}`}</div>
                                    </div>
                                </div>
                            </div>
                        })}
                    </div>
                </div>}
                {attaker.length > 0 && drawPlayer(intl.formatMessage({ id: 'key_attacker' }), attaker)}
                {midfielder.length > 0 && drawPlayer(intl.formatMessage({ id: 'key_midfielder' }), midfielder)}
                {defender.length > 0 && drawPlayer(intl.formatMessage({ id: 'key_defender' }), defender)}
                {goalkeeper.length > 0 && drawPlayer(intl.formatMessage({ id: 'key_goalkeeper' }), goalkeeper)}
                {others.length > 0 && drawPlayer(intl.formatMessage({ id: 'key_other' }), others)}
            </div>
            : <Empty />
    );
};
export default Players;
