import React, { useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl, connect } from 'umi';
import type { ConnectState } from '@/models/connect';
import ScrollView from 'react-custom-scrollbars';
import { Modal, Button, Input, Tabs, Spin, Radio } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from './index.less';
import classnames from 'classnames';
import emptyLogo from '../../assets/emptyLogo.png';
import check from '@/assets/check.svg';
import type { ClassifiedCompetition, ClassifiedCompetitionItem } from '@/services/competition';
import { classify } from '@/services/competition';
import { REPORT_ACTION, SESS_STORAGE_SELECTED_LEAGUES } from '@/constants';
import { report } from '@/services/ad';
import { checkIsPhone } from '@/utils/utils';

export type LeagueFilterModalProps = {
  open: boolean;
  close: () => void;
  onOk: (isAll: boolean, selectedIds: number[]) => void;
  isPhone: boolean;
};

const LeagueFilterModal: React.FC<LeagueFilterModalProps> = (props) => {
  const { open, close, onOk } = props;
  const timerRef = useRef<number | null>(null);
  const [isAll, setIsAll] = useState(false);
  const [curCategoryIndex, setCurCategoryIndex] = useState(0);
  const [competitionIds, setCompetitionIds] = useState<number[]>([]);
  const [competitionList, setCompetitionList] = useState<ClassifiedCompetitionItem[]>([]);
  const [competitions, setCompetitions] = useState<ClassifiedCompetition[]>([]);
  const [initialSelectedCompetitionIds, setInitialSelectedCompetitionIds] = useState<string>('');
  const [selectedCompetitionIds, setSelectedCompetitionIds] = useState<number[]>([...[]]);
  const [searchCompetitions, setSearchCompetitions] = useState<ClassifiedCompetition[]>([]);
  const floorListRef = useRef<any | null>(null);
  const floorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [ignoreScroll, setIgnoreScroll] = useState(false);
  const [isSearch, setSearchType] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>('');

  const getData = async () => {
    const res = await classify();
    if (!res.success) {
      return;
    }
    const cl = res.data.categories.reduce((p, c) => {
      return p.concat(
        c.competitions
          ?.filter((cc) => p.every((pp) => pp.id !== cc.id))
          .map((cc) => ({
            ...cc,
            name: cc.name.toLowerCase(),
          })),
      );
    }, [] as ClassifiedCompetitionItem[]);
    const clIds: number[] = [];
    const sIds: number[] = JSON.parse(
      sessionStorage.getItem(SESS_STORAGE_SELECTED_LEAGUES) || '[]',
    );
    cl.forEach((cc) => {
      clIds.push(cc.id);
    });
    setCompetitions(res.data.categories);
    setCompetitionList(cl);
    setCompetitionIds(clIds);
    setInitialSelectedCompetitionIds(JSON.stringify([...sIds].sort()));
    setSelectedCompetitionIds([...sIds]);
    if (clIds.length === sIds.length || !sIds.length) {
      setIsAll(true);
      if (!sIds.length) {
        setSelectedCompetitionIds([...clIds]);
      }
    }
  };

  const handleSearch = (pattern: string) => {
    setSearchType(true);
    setSearchInput(pattern);
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
    // @ts-ignore
    timerRef.current = setTimeout(() => {
      const w = pattern.toLowerCase();
      const res = competitionList.filter((c) => c.name.includes(w));
      setSearchCompetitions([
        {
          name: '',
          competitions: res,
        },
      ]);
    }, 100);
  };

  const handleFloorScroll = () => {
    if (ignoreScroll) {
      setTimeout(() => {
        setIgnoreScroll(false);
      }, 200);
      return;
    }
    if (!floorListRef.current) return;
    const scrollTop = floorListRef.current.getScrollTop();
    let index = 0;
    floorRefs.current?.some((f, i) => {
      // end loop
      if (!f) return true;
      if (scrollTop >= f.offsetTop) {
        index = i;
        return false;
      }
      return true;
    });
    setCurCategoryIndex(index);
  };

  const handleCategoryClick = (i: number) => {
    setIgnoreScroll(true);
    setCurCategoryIndex(i);
    const top = floorRefs.current?.[i]?.offsetTop;
    if (typeof top === 'number') {
      floorListRef.current?.scrollTop(top);
    }
  };

  const handleLeagueClick = (id: number) => {
    const i = selectedCompetitionIds.indexOf(id);
    if (i > -1) {
      selectedCompetitionIds.splice(i, 1);
      setIsAll(false);
    } else {
      selectedCompetitionIds.push(id);
      if (selectedCompetitionIds.length === competitionIds.length) {
        setIsAll(true);
      }
    }
    setSelectedCompetitionIds([...selectedCompetitionIds]);
  };

  const handleSelectAllClick = () => {
    if (isAll) {
      setSelectedCompetitionIds([]);
    } else {
      setSelectedCompetitionIds([...competitionIds]);
    }
    setIsAll(!isAll);
  };

  const handleFinishClick = async () => {
    const idStr = JSON.stringify(selectedCompetitionIds.sort());
    if (idStr !== initialSelectedCompetitionIds) {
      setInitialSelectedCompetitionIds(idStr);
      sessionStorage.setItem(SESS_STORAGE_SELECTED_LEAGUES, idStr);
      onOk(isAll, selectedCompetitionIds);
    } else {
      close();
    }

    report({
      action: REPORT_ACTION.select_finish,
      cate: REPORT_ACTION.select_league,
    });
  };

  const menu = (
    <Tabs
      tabPosition={checkIsPhone() ? 'top' : 'left'}
      className={styles.menu}
      activeKey={`${curCategoryIndex}`}
      onTabClick={(key) => {
        handleCategoryClick(Number(key));
      }}
      // inlineIndent={props.isPhone ? 12 : 24}
    >
      {competitions.map((ele, i) => {
        return <Tabs.TabPane tab={ele.name} key={i.toString()} />;
      })}
    </Tabs>
  );

  useEffect(() => {
    getData();
  }, []);

  return (
    <Modal
      className={styles.leagueFilterModal}
      onCancel={close}
      visible={open}
      width={784}
      footer={null}
      // closable={false}
      bodyStyle={{ borderRadius: '16px' }}
      maskStyle={{ background: 'rgba(0,0,0,0.2)' }}
      centered={true}
    >
      <Spin spinning={competitions.length === 0}>
        <div className={styles.container}>
          <div className={styles.title}>
            <FormattedMessage id="key_select_the_league" />
          </div>
          <Input.Search
            placeholder={useIntl().formatMessage({ id: 'key_search_for_leagues' })}
            loading={false}
            className={styles.search}
            size="large"
            prefix={<SearchOutlined className={styles.SearchOutlined} />}
            value={searchInput}
            onChange={(v) => {
              handleSearch(v.target.value);
            }}
          />
          <div className={styles.box}>
            {checkIsPhone() && !isSearch && menu}
            <div className={styles.content}>
              {!checkIsPhone() && !isSearch && (
                <div className={styles.category}>
                  <ScrollView>{menu}</ScrollView>
                </div>
              )}
              <div className={styles.categoryContent}>
                <ScrollView
                  onScroll={handleFloorScroll}
                  ref={floorListRef}
                  renderTrackHorizontal={() => <div style={{ display: 'none' }} />}
                  renderThumbHorizontal={() => <div style={{ display: 'none' }} />}
                >
                  <div className={styles.list}>
                    {(isSearch ? searchCompetitions : competitions).map((ele, i) => {
                      return (
                        <div className={styles.floor} key={ele.name}>
                          {ele.name && (
                            <div
                              className={styles.floorTitle}
                              ref={(el) => {
                                floorRefs.current[i] = el;
                              }}
                            >
                              <div className={styles.floorTitleLine} />
                              <div className={styles.floorTitleText}>{ele.name}</div>
                              <div className={styles.floorTitleLine} />
                            </div>
                          )}
                          <div className={styles.floorContent}>
                            {ele.competitions.map((c) => {
                              const isSubscribed = isAll || selectedCompetitionIds.includes(c.id);
                              return (
                                <div
                                  className={styles.logoCon}
                                  key={`${ele.name}_${c.id}`}
                                  onClick={() => {
                                    handleLeagueClick(c.id);
                                  }}
                                >
                                  <img className={styles.logo} src={c.logo || emptyLogo} />
                                  {isSubscribed && <img className={styles.check} src={check} />}
                                  <div className={styles.name}>
                                    <span className={styles.nameText}>{c.name}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollView>
              </div>
            </div>
            <div className={styles.footer}>
              {!isSearch && (
                <div className={styles.top}>
                  <div className={styles.radio}>
                    <Radio checked={isAll} onClick={handleSelectAllClick}>
                      <span>
                        <FormattedMessage id="key_select_all" />
                      </span>
                    </Radio>
                  </div>
                  <div className={styles.selectedTip}>
                    {selectedCompetitionIds.length} <FormattedMessage id="key_leagues_selected" />
                  </div>
                </div>
              )}
              {!isSearch ? (
                <Button
                  className={classnames(styles.button, styles.choose)}
                  onClick={handleFinishClick}
                  disabled={selectedCompetitionIds.length === 0}
                  type="primary"
                >
                  <span>
                    <FormattedMessage id="key_finish" />
                  </span>
                </Button>
              ) : (
                <Button
                  className={classnames(styles.button, styles.back)}
                  onClick={() => {
                    setSearchType(false);
                    setSearchInput('');
                  }}
                  type="default"
                >
                  <span>
                    <FormattedMessage id="key_back" />
                  </span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </Spin>
    </Modal>
  );
};
export default connect(({ user, divice }: ConnectState) => ({
  currentUser: user.currentUser,
  isPhone: divice.isPhone,
}))(LeagueFilterModal);
