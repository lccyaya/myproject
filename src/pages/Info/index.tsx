import React, { useState, useEffect } from 'react';
import { Menu, message, Tag, Spin, Divider, Dropdown } from 'antd';
import type { RouteComponentProps } from 'dva/router';
import classnames from 'classnames';
import { parseUrl } from 'query-string';
import ScrollView from 'react-custom-scrollbars';
import { connect, FormattedMessage } from 'umi';
import type { ConnectState } from '@/models/connect';
import * as competitionService from '@/services/competition';
import Ranking from './ranking';
import Feature from './feature';
import moment from 'moment';
import IconFont from '@/components/IconFont';

const { SubMenu } = Menu;
const { CheckableTag } = Tag;

import styles from './index.less';
import { report } from '@/services/ad';
import { REPORT_ACTION, REPORT_CATE } from '@/constants';
import * as matchService from '@/services/match';
import { checkIsPhone } from '@/utils/utils';
type TabType = 'tables' | 'fixtures';

type IProps = {
  ssrLeagues?: competitionService.CompetitionsCategoryItemType[];
  ssrDefaultOpenKeys?: string[];
  ssrDefaultSelectedKeys?: string[];
  ssrSelectedCompetitionId?: number;
  ssrRanking?: matchService.MatchRankingType;
  hideLoading?: boolean;
} & RouteComponentProps<{
  id: string;
}>;

const Info: React.FC<IProps> = (props) => {
  const {
    ssrLeagues,
    hideLoading,
    ssrDefaultOpenKeys,
    ssrDefaultSelectedKeys,
    ssrSelectedCompetitionId,
    // ssrRanking,
  } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<competitionService.CompetitionsCategoryItemType[]>(
    ssrLeagues || [],
  );
  const [detailType, setDetailType] = useState<TabType>('tables');
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<number>(
    ssrSelectedCompetitionId ?? 0,
  );
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState<string[]>(
    ssrDefaultSelectedKeys || [],
  );
  const [defaultOpenKeys, setDefaultOpenKeys] = useState<string[]>(ssrDefaultOpenKeys || []);
  const [clientTouched, setClientTouched] = useState(false);
  const [curSeason, setCurSeason] = useState<string>('');
  const [curSeasonId, setCurSeasonId] = useState<string>('');
  const [seasonList, setSeasonList] = useState([]);
  const [visible, setVisible] = useState(false);

  const fetchSeasonData = async (competitionId: any) => {
    const result = await matchService.getSeasonList(competitionId);
    if (result.success) {
      const seasonList = result.data;
      setSeasonList(seasonList);
      const curSeacon = seasonList.find((item: any) => item.is_current);
      if (curSeacon) {
        const { year, ID } = curSeacon;
        setCurSeason(year && year.replace('-', '/'));
        setCurSeasonId(ID);
      }
    }
  };
  const init = async () => {
    setLoading(!hideLoading);
    setClientTouched(true);
    const result = await competitionService.category();
    setLoading(false);
    if (result.success) {
      const { categories } = result.data;
      if (categories && categories.length > 0) {
        setData(categories);

        const urlString = window.location.toString();
        const split = urlString.split('?');
        let competitionId = 0;
        if (split[1]) {
          const search = parseUrl(`?${split[1]}`).query;
          const hotTag = categories.find((ele) => ele.name === 'Hot' || ele.name === '热门');
          if (hotTag && search.id) {
            competitionId = +search.id;
            setDefaultOpenKeys(['Hot']);
            setDefaultSelectedKeys([`${search.id}`]);
            setSelectedCompetitionId(+search.id);
          }
        } else {
          if (categories[0].competitions && categories[0].competitions.length > 0) {
            competitionId = categories[0].competitions[0].id;
            setDefaultOpenKeys([categories[0].name]);
            setDefaultSelectedKeys([`${categories[0].competitions[0].id}`]);
            setSelectedCompetitionId(categories[0].competitions[0].id);
          }
        }
        fetchSeasonData(competitionId);
      }
    } else {
      message.error(result.message);
    }
  };

  const handleTab2Change = (type: TabType) => {
    setDetailType(type);
    report({
      cate: REPORT_CATE.info,
      action: REPORT_ACTION.info_tab2 + type,
    });
  };

  useEffect(() => {
    init();
  }, []);

  const menu = (
    <Menu
      className={styles.menu}
      defaultSelectedKeys={defaultSelectedKeys}
      defaultOpenKeys={checkIsPhone() ? undefined : defaultOpenKeys}
      mode={checkIsPhone() ? 'horizontal' : 'inline'}
      theme="light"
      onSelect={(e) => {
        setSelectedCompetitionId(e.key as number);
        setCurSeasonId('');
        fetchSeasonData(e.key);
      }}
    >
      {data.map((item) => {
        return (
          <SubMenu key={item.name} title={item.name}>
            {item.competitions &&
              item.competitions.map((i) => (
                <Menu.Item
                  key={i.id}
                  onClick={() => {
                    if (Number(selectedCompetitionId) === i.id) return;
                    report({
                      cate: REPORT_CATE.info,
                      action: REPORT_ACTION.info_tab + i.name,
                    });
                  }}
                >
                  {i.name}
                </Menu.Item>
              ))}
          </SubMenu>
        );
      })}
    </Menu>
  );

  const seasonMenu = (
    <Menu>
      <div className={styles.season_wrap}>
        {seasonList.map((item) => {
          const { year, ID } = item;
          return (
            <div
              className={styles.season_list}
              key={ID}
              onClick={() => {
                setCurSeasonId(ID);
                setCurSeason(year && year.replace('-', '/'));
                setVisible(false);
              }}
            >
              {year && year.replace('-', '/')}
            </div>
          );
        })}
      </div>
    </Menu>
  );

  const content = (
    <>
      <div className={styles.header}>
        <div>
          <CheckableTag
            className={styles.tabButton}
            onClick={() => handleTab2Change('tables')}
            key="tables"
            checked={detailType === 'tables'}
          >
            <FormattedMessage id="key_tables" />
          </CheckableTag>
          <CheckableTag
            className={styles.tabButton}
            onClick={() => handleTab2Change('fixtures')}
            checked={detailType === 'fixtures'}
            key="fixtures"
          >
            <FormattedMessage id="key_fixtures" />
          </CheckableTag>
        </div>
        <Dropdown
          visible={visible}
          onVisibleChange={setVisible}
          overlay={seasonMenu}
          trigger={['click']}
        >
          <div className={styles.season_name}>
            <div>
              <FormattedMessage id="key_season" /> <span>{curSeason}</span>
            </div>
            <span className={styles.icon_wrap}>
              <IconFont type="icon-zhankai" color="#fff" />
            </span>
          </div>
        </Dropdown>
      </div>
      <Divider style={{ margin: '10px 0px' }} />
      <div>
        {detailType === 'tables' && (
          <Ranking
            competitionId={selectedCompetitionId!}
            hideLoading={!clientTouched && hideLoading}
            seasonId={curSeasonId}
          />
        )}
        {detailType === 'fixtures' && (
          <Feature seasonId={curSeasonId} competitionId={selectedCompetitionId!} />
        )}
      </div>
    </>
  );

  return (
    <Spin className={styles.spin} spinning={loading || !selectedCompetitionId}>
      <div className={styles.main}>
        {!loading && selectedCompetitionId && (
          <>
            {checkIsPhone() ? (
              menu
            ) : (
              <div className={classnames(styles.left)}>
                <ScrollView autoHide>{menu}</ScrollView>
              </div>
            )}
            <div className={styles.right}>
              {checkIsPhone() ? (
                <div style={{ height: '100%', overflowX: 'hidden', overflowY: 'scroll' }}>
                  {content}
                </div>
              ) : (
                <ScrollView autoHide>{content}</ScrollView>
              )}
            </div>
          </>
        )}
      </div>
    </Spin>
  );
};

// // @ts-ignore
// Info.getInitialProps = async (ctx) => {
//   const { query = {} } = ctx.history.location;
//   const result = await competitionService.category();
//   let ssrLeagues: competitionService.CompetitionsCategoryItemType[] = [];
//   let ssrDefaultOpenKeys: string[] = [];
//   let ssrDefaultSelectedKeys: string[] = [];
//   let ssrSelectedCompetitionId = 0;
//   if (result.success) {
//     const { categories } = result.data;
//     if (categories && categories.length > 0) {
//       ssrLeagues = categories;
//       if (query.id) {
//         const hotTag = categories.find((ele) => ele.name === 'Hot' || ele.name === '热门');
//         if (hotTag && query.id) {
//           ssrDefaultOpenKeys = ['Hot'];
//           ssrDefaultSelectedKeys = [`${query.id}`];
//           ssrSelectedCompetitionId = +query.id;
//         }
//       } else if (categories[0].competitions && categories[0].competitions.length > 0) {
//         ssrDefaultOpenKeys = [categories[0].name];
//         ssrDefaultSelectedKeys = [`${categories[0].competitions[0].id}`];
//         ssrSelectedCompetitionId = categories[0].competitions[0].id;
//       }
//     }
//   }
//   let ssrRanking: matchService.MatchRankingType | undefined;
//   if (ssrSelectedCompetitionId) {
//     const res = await competitionService.ranking({ competition_id: ssrSelectedCompetitionId });
//     if (res.success) {
//       ssrRanking = res.data;
//     }
//   }

//   return {
//     ssrLeagues,
//     ssrDefaultOpenKeys,
//     ssrDefaultSelectedKeys,
//     ssrSelectedCompetitionId,
//     ssrRanking,
//     hideLoading: true,
//   };
// };

export default Info;
// export default connect(({ divice }: ConnectState) => ({
//   isPhone: divice.isPhone,
// }))(Info);
