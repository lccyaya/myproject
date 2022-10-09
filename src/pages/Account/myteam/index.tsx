import React, { useEffect, useState } from 'react';
import { Row, Col, Button } from 'antd';
import { Link } from 'umi';
import classNames from 'classnames';
import styles from './index.less';
import { FormattedMessage } from 'react-intl';
import emptyLogo from '@/assets/emptyLogo.png';
import TeamLikeModal from '@/components/TeamLikeModal';
import * as matchService from '@/services/matchPage';
import type { subscribeTeamsType } from '@/services/matchPage';
import { report } from '@/services/ad';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';
import Notification from '@/components/Notification';

// const { CheckableTag } = Tag;

const MyTeam: React.FC = () => {
  const [teamList, setTeamList] = useState<subscribeTeamsType[]>([]);
  const [teamClickVisible, setTeamClickVisible] = useState<boolean>(false);
  const [notificationVisible, setNotificationVisible] = useState(false);

  const hanldeClick = () => {
    report({
      cate: REPORT_CATE.my_team,
      action: REPORT_ACTION.attention_more,
    });
    setTeamClickVisible(true);
  }

  const getSubscribeTeams = async () => {
    const result = await matchService.getSubscribeTeams({ page: 1, size: 1000 });
    if (result.success && result.data.team) {
      const teamData = result.data.team.map((ele: subscribeTeamsType) => {
        return {
          ...ele,
          follow: true
        }
      })
      setTeamList(teamData);
    }
  }

  useEffect(() => {
    getSubscribeTeams()
  }, [])


  const handleFollow = (id: number, bool: boolean) => {
    report({
      cate: REPORT_CATE.my_team,
      action: bool ? REPORT_ACTION.attention : REPORT_ACTION.unsubscribe,
    });
    const newData = JSON.parse(JSON.stringify(teamList));
    const currentTeam = newData.find((ele: subscribeTeamsType) => {
      return ele.id === id;
    })
    if (currentTeam) {
      currentTeam.follow = bool;
      setTeamList(newData);
    }
    if (bool) {
      matchService.subscribeTeam([id]);
      setNotificationVisible(true);
    } else {
      matchService.unsubscribeTeam(id);
    }
  }

  const lang = toShortLangCode(locale.getLocale());

  return (
    <Row className={styles.main}>
      <Notification
        visible={notificationVisible}
        onCancel={() => setNotificationVisible(false)}
        onOk={() => setNotificationVisible(false)}
      />
      <div className={styles.cardContainer}>
        <div className={classNames(styles.card, styles.follow)} onClick={hanldeClick}>
          <div className={styles.plus}>+</div>
          <div className={styles.followme}>
            <FormattedMessage id="key_follow_more" />
          </div>
        </div>
      </div>
      {teamList.map((ele: subscribeTeamsType) => {
        return <div className={styles.cardContainer} key={ele.id}>
          <Row className={styles.card}>
            <Col span={8}>
              <Link to={`/${lang}/teamdetails/${ele.id}`}>
                <img className={styles.logo} src={ele.logo || emptyLogo} />
              </Link>
            </Col>
            <Col className={styles.intro} span={16}>
              <div className={styles.text}>
                <span className={styles.textName}>{ele.name}</span>
              </div>
              {ele.follow ? <Button
                className={styles.button}
                type="dashed"
                onClick={() => {
                  handleFollow(ele.id, false)
                }}><FormattedMessage id="key_following" /></Button>
                : <Button
                  className={styles.button}
                  type="primary"
                  onClick={() => {
                    handleFollow(ele.id, true)
                  }}
                ><FormattedMessage id="key_follow" /></Button>}
            </Col>
          </Row>
        </div>
      })}
      {teamClickVisible && <TeamLikeModal
        isRegister={false}
        open={teamClickVisible}
        close={() => {
          setTeamClickVisible(false)
        }}
        onOk={() => {
          getSubscribeTeams();
          setTeamClickVisible(false)
          setNotificationVisible(true);
        }}
       />}
    </Row>
  );
};
export default MyTeam;
// export default connect(({ divice }: ConnectState) => ({
//   isPhone: divice.isPhone,
// }))(Download);
