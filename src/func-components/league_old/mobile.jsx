import React, { useState, useEffect, createRef, useMemo } from 'react';
import { Tabs, Spin, Button, Radio } from 'antd';
import styles from './mobile.module.less';
import IconFont from '@/components/IconFont';
import { Search, Empty } from '@/base-components/mobile';
import cls from 'classnames';
import { competitionFilter } from '@/services/competition';
import { FormattedMessage, useIntl, useRequest } from 'umi';
import { COMPETITION_STATUS } from '@/constants/index';
import {
  SESS_STORAGE_SELECTED_LEAGUES,
  SESS_STORAGE_LEAGUES_KEY,
  getSessionStorage,
} from '@/constants';
import { getTheSame, includes } from '@/utils/utils';
import { useSessionStorageState } from 'ahooks';
import emptyLogo from '@/assets/emptyLogo.png';
import check from '@/assets/check.svg';
import { isJustInitData } from './tools';
const League = React.memo(({ visible, onClose = () => {}, onSubmit = () => {} }) => {
  const intl = useIntl();
  const floorRefs = createRef();
  const [selectedIds, setSelectedIds] = useState(
    getSessionStorage(SESS_STORAGE_SELECTED_LEAGUES, '[]'),
  );
  const [allIds, setAllIds] = useState([]);
  const [tab, setTab] = useSessionStorageState(SESS_STORAGE_LEAGUES_KEY, {
    defaultValue: COMPETITION_STATUS['main'],
  });
  const [tempraryTab, setTempraryTab] = useState('');
  const [keyword, setKeyword] = useState('');
  const [allLen, setAllLen] = useState(0);
  const [data, setData] = useState([]);

  // 整理联赛信息
  const sortList = (categories, isfirst, callback = () => {}) => {
    const idLens = [];
    const ids = [...selectedIds];
    const tdata = [];
    categories.map((item) => {
      item.competitions.map((subItem) => {
        // 统计总数量 去重
        if (idLens.indexOf(subItem.id) === -1) {
          idLens.push(subItem.id);
          tdata.push(subItem);
        }
        if (isfirst && !selectedIds.length) {
          // 第一次 选中所有
          if (ids.indexOf(subItem.id) === -1) {
            ids.push(subItem.id);
          }
        }
      });
    });
    setData(tdata);
    setAllLen(idLens.length);

    const selectIds = getTheSame(ids, idLens);
    setSelectedIds(selectIds);

    callback(selectIds);
  };

  // 获取联赛列表
  const {
    data: dataResult = {},
    loading,
    run: getFilter,
  } = useRequest(competitionFilter, {
    initialData: {},
    manual: true,
    formatResult: ({ data, success }) => {
      if (success) {
        const tabVal = tempraryTab || tab;
        const categories = data?.categories;
        sortList(categories, tabVal === 'MAIN' && !dataResult.ALL && 'isfirst', (selectedIds) => {
          if (tabVal === 'MAIN' && dataResult.ALL) {
            sortAllDataId('MAIN', selectedIds, allIds); // 整理all的数据
          }
        }); // 整理联赛信息
        dataResult[tabVal] = categories;
        if (tabVal === COMPETITION_STATUS['main'] && !dataResult[COMPETITION_STATUS['all']]) {
          setTempraryTab(COMPETITION_STATUS['all']);
          getFilter({ tab: COMPETITION_STATUS['ALL'] }); // 初始加载为main的时候，自动把all的数据也提前获取到
        } else {
          setTempraryTab('');
        }
        return dataResult;
      }
      return [];
    },
  });

  // 整理all的数据
  const sortAllDataId = (e = 'MAIN', selectedIds, allIdList) => {
    if (e === 'MAIN') {
      setAllIds(allIdList.filter((item) => !selectedIds.includes(item)));
    } else {
      setSelectedIds([...selectedIds, ...allIds]);
    }
  };

  // 菜单点击
  const onMenuChange = (e) => {
    let allIdList = [...allIds];
    if (e === 'MAIN') {
      allIdList = [...selectedIds];
    }
    setTab(e);
    if (dataResult[e]) {
      sortList(dataResult[e], '', (selectedIds) => {
        sortAllDataId(e, selectedIds, allIdList); // 整理all的数据
      });
    } else {
      setAllIds(selectedIds);
    }
    const current = floorRefs?.current;
    current.scrollTop = 0;
  };

  // 左侧菜单点击
  const onMenuClick = (e) => {
    const current = floorRefs?.current;
    const top = current.getElementsByTagName('h5')[+e].offsetTop;
    current.scrollTop = top - 100;
  };

  // 是否全部选中
  const isAll = (() => {
    const len = selectedIds.length;
    if (len && len === allLen) {
      return true;
    }
    return false;
  })();

  // 是否为空
  const isEmpty = useMemo(() => {
    if (loading) {
      return false;
    }
    if (!keyword) {
      return false;
    } else if (keyword && data?.filter((item) => includes(item.name, keyword)).length) {
      return false;
    }
    return true;
  }, [keyword, dataResult, tab, loading]);

  // 选择联盟
  const handleLeagueClick = (id) => {
    const ids = [...selectedIds];
    const i = ids.indexOf(id);
    if (i > -1) {
      ids.splice(i, 1);
    } else {
      ids.push(id);
    }
    setSelectedIds([...ids]);
  };

  // 全选/非全选
  const handleSelectAllClick = () => {
    const ids = [];
    if (!isAll) {
      data.map((item) => ids.indexOf(item.id) === -1 && ids.push(item.id));
    }
    setSelectedIds(ids);
  };

  // 选中
  const handleFinishClick = () => {
    if (
      selectedIds.length === 50 &&
      (tab === COMPETITION_STATUS['main'] || isJustInitData(dataResult['MAIN'], selectedIds))
    ) {
      // 选中的是默认的数据 所以不要高亮
      sessionStorage.setItem(SESS_STORAGE_SELECTED_LEAGUES, '[]');
      onSubmit([]);
      setTab('MAIN');
    } else {
      sessionStorage.setItem(SESS_STORAGE_SELECTED_LEAGUES, JSON.stringify(selectedIds));
      onSubmit(selectedIds);
    }

    onClose();
  };

  useEffect(() => {
    if (visible && (!dataResult || !dataResult[tab]) && tempraryTab !== tab) {
      getFilter({ tab: COMPETITION_STATUS[tab] });
    }
  }, [visible, tab]);

  const dataWithTitle = dataResult[tab] || [];

  const ListItem = ({ subItem, name }) => {
    const isSubscribed = isAll || selectedIds.indexOf(subItem.id) > -1;
    return (
      <div
        className={cls(styles.logoCon)}
        key={`${name}_${subItem.id}`}
        onClick={() => {
          handleLeagueClick(subItem.id);
        }}
      >
        <img className={styles.logo} src={subItem.logo || emptyLogo} />
        {isSubscribed ? <img className={styles.check} src={check} /> : null}
        <div className={styles.name}>
          <span className={styles.nameText}>{subItem.name}</span>
        </div>
      </div>
    );
  };

  return (
    <div className={cls(styles.league, visible ? styles.show : null)}>
      <i className={styles.bg} onClick={onClose}></i>
      <div className={styles.content}>
        <IconFont className={styles.close} type="icon-yuanquanguanbi" size={24} onClick={onClose} />
        <h5 className={styles.title}>
          {intl.formatMessage({
            id: 'key_select_the_league',
            defaultMessage: 'key_select_the_league',
          })}
        </h5>

        <Spin spinning={loading || tempraryTab === tab}>
          <div className={styles.search}>
            {/* onMenuChange */}
            <Search
              className={keyword ? styles.has_keyword : null}
              value={keyword}
              onChange={(e) => {
                if (tab === 'MAIN' && !keyword && e) {
                  onMenuChange(COMPETITION_STATUS['all']);
                }
                setKeyword(e);
              }}
              placeholder={intl.formatMessage({ id: 'key_search_for_leagues' })}
            />
          </div>

          {/* 菜单 */}
          {keyword ? null : (
            <Tabs activeKey={tab} centered onChange={onMenuChange}>
              <Tabs.TabPane
                tab={intl.formatMessage({ id: 'key_main', defaultMessage: 'key_main' })}
                key={COMPETITION_STATUS['main']}
              />
              <Tabs.TabPane
                tab={intl.formatMessage({ id: 'key_all', defaultMessage: 'key_all' })}
                key={COMPETITION_STATUS['all']}
              />
            </Tabs>
          )}

          <div className={styles.competition_list}>
            <div className={styles.list} ref={floorRefs}>
              {/* 无数据展示 */}
              {isEmpty && !loading ? <Empty /> : null}

              {/* 列表 */}
              {!keyword
                ? dataWithTitle?.map((item, i) => {
                    return (
                      <div className={cls(styles.floor)} key={item.name}>
                        <h5 className={styles.title}>
                          <span>{item.name}</span>
                        </h5>
                        <div className={styles.floorContent}>
                          {item.competitions.map((subItem) => (
                            <ListItem name={item.name} subItem={subItem} />
                          ))}
                        </div>
                      </div>
                    );
                  })
                : data
                    ?.filter((item) => includes(item.name, keyword))
                    .map((item, key) => {
                      return <ListItem name={key} subItem={item} />;
                    })}
            </div>
          </div>

          {/* 底部 */}
          <div className={styles.footer}>
            {!keyword && (
              <div className={styles.top}>
                <label className={styles.radio}>
                  <Radio checked={isAll} onClick={handleSelectAllClick}>
                    <span>
                      <FormattedMessage id="key_select_all" />
                    </span>
                  </Radio>
                </label>
                <div className={styles.selectedTip}>
                  {selectedIds.length} <FormattedMessage id="key_leagues_selected" />
                </div>
              </div>
            )}
            {keyword ? (
              <Button
                className={cls(styles.button, styles.back)}
                onClick={() => setKeyword('')}
                type="default"
              >
                <span>
                  <FormattedMessage id="key_back" />
                </span>
              </Button>
            ) : (
              <Button
                className={cls(styles.button, styles.choose)}
                onClick={handleFinishClick}
                disabled={selectedIds.length === 0}
                type="primary"
              >
                <span>
                  <FormattedMessage id="key_finish" />
                </span>
              </Button>
            )}
          </div>
        </Spin>
      </div>
    </div>
  );
});

export default League;
