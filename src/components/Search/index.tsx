import React, { useState } from 'react';
import {
    FormattedMessage,
    connect,
    Link
} from 'umi';
import type { ConnectState } from '@/models/connect';
import ScrollView from 'react-custom-scrollbars';
import { Row, Button, Col } from 'antd';
import styles from './index.less';
import classnames from 'classnames';
import * as matchService from '@/services/matchPage';
import type { team } from '@/services/matchPage';
import emptyLogo from '../../assets/emptyLogo.png';
import Empty from '@/components/Empty';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';

export type SearchProps = {
    setSearchInput: (s: string) => void;
    setSearchType: (b: boolean) => void;
    serchTeamList: team[];
    setSerchTeamList: (t: team[]) => void;
};

const Search: React.FC<SearchProps> = (props) => {
    const { setSearchInput, setSearchType, serchTeamList, setSerchTeamList } = props;

    const handleFollow = (id: number, bool: boolean) => {
        const newData = JSON.parse(JSON.stringify(serchTeamList));
        const currentTeam = newData.find((ele: team) => {
            return ele.team_id === id;
        })
        if (currentTeam) {
            currentTeam.subscribed = bool;
            setSerchTeamList(newData);
        }
        if (bool) {
            matchService.subscribeTeam([id]);
        } else {
            matchService.unsubscribeTeam(id);
        }
    }

  const lang = toShortLangCode(locale.getLocale());
  return (
        <div className={styles.box}>
            <Row className={styles.content}>
                <ScrollView
                    renderTrackHorizontal={() => <div style={{ display: "none" }} />}
                    renderThumbHorizontal={() => <div style={{ display: "none" }} />}
                >
                    {serchTeamList.length > 0 ?
                        <Row>
                            {
                                serchTeamList.map((ele: team) => {
                                    return <div className={styles.cardContainer} key={ele.team_id}>
                                        <Row className={styles.card}>
                                            <Col span={10}>
                                                <Link to={`/${lang}/teamdetails/${ele.team_id}`}>
                                                    <img className={styles.logo} src={ele.team_logo || emptyLogo} />
                                                </Link>
                                            </Col>
                                            <Col className={styles.intro} span={14}>
                                                <div className={styles.text}>
                                                    <span className={styles.textName}>{ele.team_name}</span>
                                                </div>
                                                {ele.subscribed ? <Button
                                                    className={styles.button}
                                                    type="dashed"
                                                    onClick={() => {
                                                        handleFollow(ele.team_id, false)
                                                    }}><FormattedMessage id="key_following" /></Button>
                                                    : <Button
                                                        className={styles.button}
                                                        type="primary"
                                                        onClick={() => {
                                                            handleFollow(ele.team_id, true)
                                                        }}
                                                    ><FormattedMessage id="key_follow" /></Button>}
                                            </Col>
                                        </Row>
                                    </div>
                                })
                            }
                        </Row> :
                        <div className={styles.empty}><Empty /></div>}
                </ScrollView>
            </Row>
            <div className={styles.footer}>
                <Button
                    className={classnames(styles.button, styles.close)}
                    onClick={() => {
                        setSearchInput('');
                        setSearchType(false);
                    }}
                >
                    <FormattedMessage id='key_back' />
                </Button>
            </div>
        </div>
    );
};
// export default TeamLikeModal;
export default connect(({ user, divice }: ConnectState) => ({
    currentUser: user.currentUser,
    isPhone: divice.isPhone,
}))(Search);
