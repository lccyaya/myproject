import React, { useEffect, useState } from 'react';
import {
    FormattedMessage,
    useIntl,
    connect,
} from 'umi';
import type { ConnectState } from '@/models/connect';
import ScrollView from 'react-custom-scrollbars';
import { Row, Modal, Button, Col, Input, Tabs, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from './index.less';
import classnames from 'classnames';
import * as matchService from '@/services/matchPage';
import type { hotCompetition, competitionTab, team } from '@/services/matchPage';
import emptyLogo from '../../assets/emptyLogo.png';
import check from '@/assets/check.svg';
import { mixTextOverflow } from './utils';
import Search from '../Search';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';
import { report } from '@/services/ad';
import { checkIsPhone } from '@/utils/utils';

export type TeamLikeModalProps = {
    open: boolean;
    close: () => void;
    onOk: () => void;
    isPhone: boolean;
    isRegister?: boolean;
};

const TeamLikeModal: React.FC<TeamLikeModalProps> = (props) => {
    const { open, close, onOk, isRegister } = props;
    const [isSearch, setSearchType] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState<string>('');
    const [matchType, setMatchType] = useState<string | number>('');
    const [competitionList, setCompetitionList] = useState<hotCompetition[]>([]);
    const [chooseValue, setChooseValue] = useState<number>(0);
    const [teamTabList, setTeamTabList] = useState<competitionTab['list']>([]);
    const [teamState, setTeamState] = useState<object>({});
    const [initTeamState, setInitTeamState] = useState<object>({});
    const [serchTeamList, setSerchTeamList] = useState<team[]>([]);

    const tl = teamTabList.find((ele) => {
        return ele.name === matchType;
    })
    const teamList = tl ? tl.teams : [];

    const getCompetitionTabData = async () => {
        const result = await matchService.getCompetitionTab();
        if (result.success) {
            if (result.data.list) {
                setTeamTabList(result.data.list);
                const countObj = {};
                const initTeamState = {};
                const cpList = result.data.list.map((ele) => {
                    ele.teams.forEach((t) => {
                        if (t.subscribed) {
                            countObj[t.team_id] = 0;
                        }
                        initTeamState[t.team_id] = t.subscribed;
                    })
                    return { name: ele.name, id: ele.name }
                })

                setTeamState(initTeamState);
                setInitTeamState(initTeamState);
                const countKeys = Object.keys(countObj);
                setCompetitionList(cpList);
                setChooseValue(countKeys.length);
                if (cpList[0]) setMatchType(cpList[0].id);
            }
        }
    }

    const setSubscribeTeam = (key: number, bool: boolean) => {
        const newData = JSON.parse(JSON.stringify(teamState))
        newData[key] = bool;
        setTeamState(newData);
        const count = bool ? chooseValue + 1 : chooseValue - 1;
        setChooseValue(count);
    }

    useEffect(() => {
        getCompetitionTabData();
    }, [])

    const handleChoose = (key: number) => {
        const bool = teamState[key];
        if (bool) {
            setSubscribeTeam(key, false);
        } else {
            setSubscribeTeam(key, true);
        }
    }

    const onSearch = async (name: string) => {
        if (name) {
            const result = await matchService.teamSearch({ name });
            setSearchType(true);
            if (result.success) {
                setSerchTeamList(result.data.list || []);
            }
        }
    }

    const getDiffTeams = (isSubscribed: boolean) => {
        const group = [];
        for (const state in initTeamState) {
            const initBool = initTeamState[state];
            const currentBool = teamState[state];
            if (currentBool !== initBool && currentBool === isSubscribed) {
                group.push({ name: state, subscribed: currentBool });
            }
        }
        return group;
    }

    const menu = (
        <Tabs
            tabPosition={checkIsPhone() ? 'top' : 'left'}
            className={styles.menu}
            activeKey={`${matchType}`}
            onTabClick={(key) => {
                setMatchType(key);
            }}
        // inlineIndent={props.isPhone ? 12 : 24}
        >
            {competitionList.map((ele) => {
                return <Tabs.TabPane tab={ele.name} key={ele.id} />;
            })}
        </Tabs>
    );

    return (
        <Modal
            className={styles.teamLikeModal}
            visible={open}
            width={784}
            footer={null}
            closable={false}
            bodyStyle={{ borderRadius: '16px' }}
            maskStyle={{ background: 'rgba(0,0,0,0.2)' }}
            centered={true}
        >
            <Spin spinning={competitionList.length === 0}>
                <div className={styles.container}>
                    <div className={styles.title}>
                        {isRegister && <div className={styles.skip} onClick={() => {
                            setSearchInput('');
                            close()
                        }}><FormattedMessage id='key_skip' /></div>}
                        <FormattedMessage id='key_choose_the_team_you_like' />
                    </div>
                    <Input.Search
                        placeholder={useIntl().formatMessage({ id: 'key_search_your_team' })}
                        loading={false}
                        className={styles.search}
                        size="large"
                        prefix={<SearchOutlined className={styles.SearchOutlined} />}
                        onSearch={onSearch}
                        value={searchInput}
                        onChange={(v) => {
                            const value = mixTextOverflow(v.target.value, 40);
                            setSearchInput(value);
                        }}
                    />
                    {isSearch ?
                        <Search
                            setSearchInput={setSearchInput}
                            setSearchType={setSearchType}
                            serchTeamList={serchTeamList}
                            setSerchTeamList={setSerchTeamList}
                        /> :
                        <div className={styles.box}>
                            {checkIsPhone() && menu}
                            <Row className={styles.content}>
                                {!checkIsPhone() && (
                                    <Col span={5}>
                                        <ScrollView>{menu}</ScrollView>
                                    </Col>
                                )}
                                <Col span={checkIsPhone() ? 24 : 19}>
                                    <ScrollView
                                        renderTrackHorizontal={() => <div style={{ display: "none" }} />}
                                        renderThumbHorizontal={() => <div style={{ display: "none" }} />}
                                    >
                                        <Row className={styles.list}>
                                            {teamList && teamList.map((ele: team) => {
                                                const isSubscribed = teamState[ele.team_id];
                                                return <div
                                                    className={styles.logoCon}
                                                    key={ele.team_id}
                                                    onClick={() => {
                                                        handleChoose(ele.team_id)
                                                    }}>
                                                    <img className={styles.logo} src={ele.team_logo || emptyLogo} />
                                                    {isSubscribed && <img className={styles.check} src={check} />}
                                                    <div className={styles.name}>
                                                        <span className={styles.nameText}>{ele.team_name}</span>
                                                    </div>
                                                </div>
                                            })}
                                        </Row>
                                    </ScrollView>
                                </Col>
                            </Row>
                            <div className={styles.footer}>
                                <Button
                                    className={classnames(styles.button, styles.close)}
                                    onClick={() => {
                                        setSearchInput('');
                                        close();
                                    }}
                                >
                                    <FormattedMessage id='key_cancel' />
                                </Button>
                                <Button
                                    className={classnames(styles.button, styles.choose)}
                                    onClick={async () => {
                                        // const subscribedTeams = teamList.filter((ele) => ele.subscribed);
                                        // await matchService.subscribeTeam(subscribedTeams.map((ele) => ele.team_id));
                                        report({
                                          cate: REPORT_CATE.my_team,
                                          action: REPORT_ACTION.choose,
                                        });
                                        const subscribedTeams = getDiffTeams(true);
                                        const unsubscribedTeams = getDiffTeams(false);
                                        unsubscribedTeams.forEach((ele) => {
                                            matchService.unsubscribeTeam(+ele.name);
                                        })
                                        await matchService.subscribeTeam(subscribedTeams.map((ele) => +ele.name));
                                        setSearchInput('');
                                        onOk();
                                    }}
                                    disabled={chooseValue === 0}
                                    type="primary"
                                >
                                    <span><FormattedMessage id='key_choose' />{` (${chooseValue})`}</span>
                                </Button>
                            </div>
                        </div>
                    }</div>
            </Spin>
        </Modal>
    );
};
// export default TeamLikeModal;
export default connect(({ user, divice }: ConnectState) => ({
    currentUser: user.currentUser,
    isPhone: divice.isPhone,
}))(TeamLikeModal);
