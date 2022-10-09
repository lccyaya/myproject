import React, { useState, useEffect, createRef, useMemo, useRef } from 'react';
import { Tabs, Spin, Button, Radio, Modal } from 'antd';
import IconFont from '@/components/IconFont';
import { Search, Empty } from '@/base-components/pc';
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
import { isJustInitData, getCategories, getMainIds } from './tools';

import styles from './pc.module.less';

const CompetitionBlock = ({
  loading,
  data,
  type,
  selectedIds = [],
  setSelectedIds,
  keyword,
  setKeyword,
  handleFinishClick,
}) => {
  const listRefs = useRef();
  const getIdList = () => {
    const _list = [];
    data.map(({ competitions }) => {
      for (let i = 0; i < competitions.length; i++) {
        if (_list.indexOf(competitions[i].id) < 0) {
          _list.push(competitions[i].id);
        }
      }
    });
    return _list;
  };
  const isAll = getIdList().length === selectedIds.length && getIdList().length;
  const handleSelectAllClick = () => {
    let ids = [];
    if (!isAll) {
      ids = getIdList();
    }
    setSelectedIds(ids);
  };
  const getTotal = (data) => {
    const _list = [];
    data.map(({ competitions }) => {
      for (let i = 0; i < competitions.length; i++) {
        if (!_list.find((item) => item.id === competitions[i].id)) {
          _list.push(competitions[i]);
        }
      }
    });

    return _list;
  };
  const searchResultList = getTotal(data)?.filter((item) => includes(item.name, keyword));
  const isEmpty = keyword ? !searchResultList.length : !data.length;

  const ListItem = React.memo(({ subItem, name, isSubscribed }) => {
    return (
      <div
        className={cls(styles.logoCon)}
        key={`${name}_${subItem.id}`}
        onClick={() => {
          let ids = [...selectedIds];
          const i = ids.indexOf(subItem.id);
          if (i > -1) {
            ids.splice(i, 1);
          } else {
            ids.push(subItem.id);
          }
          setSelectedIds(ids);
        }}
      >
        <img className={styles.logo} src={subItem.logo || emptyLogo} />
        {isSubscribed ? <img className={styles.check} src={check} /> : null}
        <div className={styles.name}>
          <span className={styles.nameText}>{subItem.name}</span>
        </div>
      </div>
    );
  });

  return (
    <Spin spinning={loading}>
      {/* competition list */}
      <div className={cls(styles.competition_list, isEmpty ? styles.empty_list : null)}>
        {/* 无数据展示 */}
        {isEmpty && !loading ? <Empty /> : null}

        {/* 左侧菜单 */}
        {!isEmpty && !keyword ? (
          <Tabs
            tabPosition={'left'}
            onChange={(e) => {
              const current = listRefs?.current;
              const top = current.getElementsByTagName('h5')[+e].offsetTop;
              current.scrollTop = top - 100;
            }}
          >
            {data?.map((item, key) => (
              <Tabs.TabPane tab={item.name} key={key} />
            ))}
          </Tabs>
        ) : null}

        {/* 列表 */}
        <div className={styles.list} ref={listRefs}>
          {!keyword ? (
            data?.map((item, i) => {
              return (
                <div className={cls(styles.floor)} key={item.name}>
                  <h5 className={styles.title}>
                    <span>{item.name}</span>
                  </h5>
                  <div className={styles.floorContent}>
                    {item.competitions.map((subItem) => (
                      <ListItem
                        isSubscribed={isAll || selectedIds?.indexOf(subItem.id) > -1}
                        name={item.name}
                        subItem={subItem}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.floorContent}>
              {searchResultList.map((item, key) => {
                return (
                  <ListItem
                    isSubscribed={isAll || selectedIds?.indexOf(item.id) > -1}
                    subItem={item}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 底部 */}
      <div className={styles.footer}>
        {!keyword && (
          <div className={styles.top}>
            <label className={styles.radio}>
              <Radio
                checked={isAll}
                onClick={() => {
                  handleSelectAllClick();
                }}
              >
                <span>
                  <FormattedMessage id="key_select_all" />
                </span>
              </Radio>
            </label>
            <div className={styles.selectedTip}>
              {selectedIds.length} <FormattedMessage id="key_league_selected" />
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
            onClick={() => {
              // 选中
              handleFinishClick();
            }}
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
  );
};

const League = React.memo(({ visible, onClose = () => {}, onSubmit = () => {} }) => {
  const intl = useIntl();
  const [keyword, setKeyword] = useState('');
  const [allIds, setAllIds] = useState([]);
  const [loadedTab, setLoadedTab] = useState([]);

  // 数据和缓存数据的变量
  const [tab, setTab] = useState(getSessionStorage(SESS_STORAGE_LEAGUES_KEY, COMPETITION_STATUS.MAIN));
  const [defaultTab, setDefaultTab] = useSessionStorageState(SESS_STORAGE_LEAGUES_KEY, {
    defaultValue: COMPETITION_STATUS.MAIN,
  });
  const [defaultSelect, setDefaultSelect] = useSessionStorageState(SESS_STORAGE_SELECTED_LEAGUES, {
    defaultValue: [],
  });
  const [selectedIds, setSelectedIds] = useState(getSessionStorage(SESS_STORAGE_SELECTED_LEAGUES, false));


  const getCompetitionFilter = () => {
    return competitionFilter({
      tab: COMPETITION_STATUS.MAIN,
    })
  };
  const getMainReq = useRequest(getCompetitionFilter, {
    initialData: [],
    manual: true,
    formatResult: ({ data, success }) => {
      if (success) {
        if (defaultSelect?.length === 0) {
          const newData = getMainIds(data?.categories)
          setSelectedIds(newData);
          setDefaultSelect(newData);
        }
        return data?.categories;
      } else {
        return [];
      }
    },
  });
  const getAllCompetitionFilter = () => {
    return competitionFilter({
      tab: COMPETITION_STATUS.ALL,
    });
  };
  const getAllReq = useRequest(getAllCompetitionFilter, {
    initialData: [],
    manual: true,
    formatResult: ({ data, success }) => {
      if (success) {
        return data?.categories;
      } else {
        return [];
      }
    },
  });
  const handleClose = () => {
    setSelectedIds([...defaultSelect]);
    setTab(defaultTab);
    onClose();
  }
  const handleFinishClick = () => {
    const len = getMainReq.data.length;
    if (selectedIds.length === len && ( tab === COMPETITION_STATUS.MAIN) || isJustInitData(getMainReq.data, selectedIds )) {
      // 选中的是默认的数据 所以不要高亮
      setSelectedIds(getMainIds(getMainReq.data));
      setDefaultSelect([]);
      onSubmit([]);
      setTab(COMPETITION_STATUS.MAIN);
    } else {
      setSelectedIds(selectedIds);
      onSubmit(selectedIds);
      setDefaultSelect([...selectedIds]);
    }
    setDefaultTab(tab);
    onClose();
  };

  // 缓存all的ids
  const saveAllIds = (tab) => {
    const mainIds = getMainIds(getMainReq.data);
    if (tab === COMPETITION_STATUS.MAIN) {
      const allIdList = [...selectedIds];
      const newdata = selectedIds.filter(item => {
        return !mainIds.includes(item);
      })
      setAllIds(newdata);
      setSelectedIds(mainIds.filter(item => selectedIds.includes(item)));
    } else if(tab === COMPETITION_STATUS.ALL) {
      setSelectedIds([...selectedIds, ...allIds]);
    }
  }

  useEffect(() => {
    if (visible) {
      if (defaultSelect?.length === 0 && tab === COMPETITION_STATUS.MAIN) {
        setDefaultSelect(getMainIds(getMainReq.data));
      }
      if (!loadedTab.includes(COMPETITION_STATUS.MAIN) && !getMainReq.data.length) {        
        setLoadedTab([...loadedTab, COMPETITION_STATUS.MAIN]);
        getMainReq.run();
      }
      if (!loadedTab.includes(COMPETITION_STATUS.ALL) && !getAllReq.data.length) {
        setLoadedTab([...loadedTab, COMPETITION_STATUS.ALL]);
        getAllReq.run();
      }
    }
  }, [visible, getMainReq.data, getAllReq.data]);
  return (
    <Modal
      visible={visible}
      footer={null}
      closable={false}
      centered
      className={styles.modal_wrap}
      width={784}
      height={588}
    >
      <div className={cls(styles.league)}>
        <div className={styles.content}>
          <IconFont className={styles.close} type="icon-yuanquanguanbi" size={24} onClick={() => handleClose()} />
          <h5 className={styles.title}>
            {intl.formatMessage({
              id: 'key_select_the_league',
              defaultMessage: 'key_select_the_league',
            })}
          </h5>

          <Search
            className={keyword ? styles.has_keyword : null}
            value={keyword}
            onChange={(e) => {
              setTab(COMPETITION_STATUS.ALL);
              setKeyword(e);
            }}
            placeholder={intl.formatMessage({ id: 'key_search_for_leagues' })}
          />
          <Tabs
            activeKey={tab}
            centered
            onChange={(e)=>{
              setTab(e)
              saveAllIds(e);
            }} 
            renderTabBar={keyword ? () => <div></div> : null}
            tabBarStyle={{}}
          >
            <Tabs.TabPane
              tab={intl.formatMessage({ id: 'key_main', defaultMessage: 'key_main' })}
              key={COMPETITION_STATUS.MAIN}
            >
              <CompetitionBlock
                loading={getMainReq.loading}
                data={getMainReq.data}
                type={COMPETITION_STATUS.MAIN}
                keyword={keyword}
                setKeyword={setKeyword}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                handleFinishClick={handleFinishClick}
              />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={intl.formatMessage({ id: 'key_all', defaultMessage: 'key_all' })}
              key={COMPETITION_STATUS.ALL}
            >
              <CompetitionBlock
                loading={getAllReq.loading}
                data={getAllReq.data}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                type={COMPETITION_STATUS.ALL}
                keyword={keyword}
                setKeyword={setKeyword}
                handleFinishClick={handleFinishClick}
              />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </Modal>
    
  );
});

export default League;
