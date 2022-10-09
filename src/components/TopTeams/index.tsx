import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { FormattedMessage, Link } from 'umi';
import { Row, Col, Button } from 'antd';
import styles from './index.less';
import { getTop } from '@/services/home';
import type { topDatum, top } from '@/services/home';
import emptyLogo from '@/assets/emptyLogo.png';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';

const TopTeams: React.FC = () => {
  const [switchType, setSwitchType] = useState<'teams' | 'leagues'>('teams');
  const [data, setData] = useState<topDatum[]>([]);

  const handleSwitch = (type: 'teams' | 'leagues') => {
    getTopData(type);
    setSwitchType(type);
  };

  const getTopData = async (switchTab: top['tab']) => {
    const result = await getTop({ tab: switchTab });
    if (result.success) {
      setData(result.data.list);
    }
  };

  useEffect(() => {
    getTopData(switchType);
  }, []);
  const lang = toShortLangCode(locale.getLocale());

  return (
    <div className={styles.topTeamsContainer}>
      <Row className={styles.head}>
        <Button
          className={classnames(styles.switchButton, switchType === 'teams' ? styles.selected : '')}
          type="text"
          size="middle"
          onClick={() => {
            handleSwitch('teams');
          }}
        >
          <FormattedMessage id="key_teams" />
        </Button>
        <Button
          className={classnames(
            styles.switchButton,
            switchType === 'leagues' ? styles.selected : '',
          )}
          type="text"
          size="middle"
          onClick={() => {
            handleSwitch('leagues');
          }}
        >
          <FormattedMessage id="key_leagues" />
        </Button>
      </Row>
      <Row className={styles.content}>
        {data.map((ele: topDatum) => {
          return (
            <div className={styles.logoCon}>
                <Link to={switchType === 'teams' ? `/${lang}/teamdetails/${ele.id}` : `/${lang}/info?id=${ele.id}`}>
                  <img className={styles.logo} src={ele.logo || emptyLogo} />
                </Link>
            </div>
          );
        })}
      </Row>
    </div>
  );
};
export default TopTeams;
