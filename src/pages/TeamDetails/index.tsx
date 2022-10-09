import type { Dispatch } from 'umi';
import { connect, FormattedMessage } from 'umi';
import type { ConnectState } from '@/models/connect';
import React, { useState, useEffect } from 'react';
import { Tag, Row, Spin, Col } from 'antd';
import type { RouteComponentProps } from 'dva/router';
import { ArrowLeftOutlined } from '@ant-design/icons';
import emptyLogo from '@/assets/emptyLogo.png';
import * as matchService from '@/services/matchPage';
import type { matchType, info as infoType, teamPlayersType } from '@/services/matchPage';
import styles from './index.less';
import Trophies from './Trophies';
import Fixtures from './Fixtures';
import Players from './Players';
import Button from 'antd/es/button';
import { getDateData } from '@/components/MatchList';
import { checkIsPhone } from '@/utils/utils';
import PopupLogin from '@/components/PopupLogin';
import Notification from '@/components/Notification';

type TabType = 'fixtures' | 'players';

export type DetailProps = {
  dispatch: Dispatch;
  isPhone: boolean;
} & RouteComponentProps<{
  teamId: string;
}>;

export type trophy = {
  id: number;
  name: string;
  season: string;
};

export type trophies = {
  name: string;
  list: trophy[];
};

const { CheckableTag } = Tag;

const TeamDetails: React.FC<DetailProps> = (props) => {
  const [detailType, setDetailType] = useState<TabType>('fixtures');
  const [loading, setLoading] = useState<boolean>(true);
  const [teamLogo, setTeamLogo] = useState<string>('');
  const [teamName, setTeamName] = useState<string>('');
  const [teamSubscribed, setTeamSubscribed] = useState<boolean>(true);
  const [schedualer, setSchedualer] = useState<{ date: string; matches: matchType[] }[]>([]);
  const [info, setInfo] = useState<infoType>({ founded: 0, website: '' });
  const [trophies, setTrophies] = useState<trophies[]>([]);
  const [playersData, setPlayersData] = useState<teamPlayersType>({ coach: [], squad: [] });
  const [notificationVisible, setNotificationVisible] = useState(false);

  const { teamId } = props.match.params;

  const handleBack = () => {
    window.history.back();
  };

  const getTeamInfo = async () => {
    const result = await matchService.teamInfo({ team_id: +teamId });
    if (result.success) {
      setInfo(result.data.info);
      const final = result.data.honor_ids.map((ele: number) => {
        const list = result.data.honor[ele];
        return { name: list[0].name, list };
      });
      setTrophies(final);
    }
  };

  const getTeamPlayers = async () => {
    const result = await matchService.teamPlayers({
      team_id: +teamId,
    });
    if (result.success) {
      setPlayersData(result.data);
    }
  };

  const getTeamScheduler = async () => {
    const result = await matchService.teamScheduler({
      team_id: +teamId,
      timestamp: 0,
      asc: true,
      count: 50,
      zone: 8,
    });
    if (result.success) {
      setTeamLogo(result.data.team_logo);
      setTeamName(result.data.team_name);
      setTeamSubscribed(result.data.subscribed);
      const final = getDateData(result.data.matches);
      setSchedualer(final);
      setLoading(false);
    }
  };

  useEffect(() => {
    getTeamScheduler();
    getTeamPlayers();
    getTeamInfo();
  }, []);

  return (
    <Spin spinning={loading}>
      <Notification
        visible={notificationVisible}
        onCancel={() => setNotificationVisible(false)}
        onOk={() => setNotificationVisible(false)}
      />
      <Row className={styles.headerArea}>
        <Col className={styles.head} xs={24} sm={24} md={24} lg={15} xl={15}>
          <div className={styles.back} onClick={handleBack}>
            <ArrowLeftOutlined className={styles.arrow} />
            <div className={styles.text}>
              <FormattedMessage id="key_back" />
            </div>
          </div>
          {teamSubscribed ? (
            <PopupLogin
              onLogin={() => {
                setTeamSubscribed(false);
                matchService.unsubscribeTeam(+teamId);
              }}
            >
              <Button type="dashed" className={styles.followButton}>
                <FormattedMessage id="key_following" />
              </Button>
            </PopupLogin>
          ) : (
            <PopupLogin
              onLogin={() => {
                setNotificationVisible(true);
                setTeamSubscribed(true);
                matchService.subscribeTeam([+teamId]);
              }}
            >
              <Button type="primary" className={styles.followButton}>
                <FormattedMessage id="key_follow" />
              </Button>
            </PopupLogin>
          )}
        </Col>
      </Row>
      <div className={styles.main}>
        <Row className={styles.container} gutter={24} style={checkIsPhone() ? { margin: 0 } : {}}>
          <Col className={styles.left} xs={24} sm={24} md={24} lg={15} xl={15}>
            <div className={styles.detailCard}>
              <img className={styles.logo} src={teamLogo || emptyLogo} />
              <div className={styles.text}>{teamName}</div>
            </div>
            <Row className={styles.header}>
              <CheckableTag
                className={styles.tabButton}
                onClick={() => setDetailType('fixtures')}
                key="fixtures"
                checked={detailType === 'fixtures'}
              >
                <FormattedMessage id="key_fixtures" />
              </CheckableTag>
              <CheckableTag
                className={styles.tabButton}
                onClick={() => setDetailType('players')}
                checked={detailType === 'players'}
                key="players"
              >
                <FormattedMessage id="key_players" />
              </CheckableTag>
            </Row>
            {teamId && (
              <div>
                {detailType === 'fixtures' && <Fixtures data={schedualer} />}
                {detailType === 'players' && <Players data={playersData} />}
              </div>
            )}
          </Col>
          <Col className={styles.right} xs={24} sm={24} md={24} lg={9} xl={9}>
            <Row className={styles.title}>
              <FormattedMessage id="key_info_tab" />
            </Row>
            <div className={styles.info}>
              <Row>
                <Col span={7} className={styles.intro}>
                  <FormattedMessage id="key_founded_in" />
                </Col>
                <Col span={17} className={styles.text}>
                  {info.founded || <FormattedMessage id="key_unknown" />}
                </Col>
              </Row>
              <Row>
                <Col span={7} className={styles.intro}>
                  <FormattedMessage id="key_website" />
                </Col>
                <Col span={17} className={styles.text}>
                  {info.website || <FormattedMessage id="key_unknown" />}
                </Col>
              </Row>
            </div>
            <Row className={styles.title}>
              <FormattedMessage id="key_trophies" />
            </Row>
            <Trophies data={trophies} />
            {/* <Button className={styles.footer}>
              <FormattedMessage id="key_view_more" />
            </Button> */}
          </Col>
        </Row>
      </div>
    </Spin>
  );
};
// export default Details;
export default connect(({ divice }: ConnectState) => ({
  isPhone: divice.isPhone,
}))(TeamDetails);
