import styles from './league-team-filter.less';
import { CheckCircleFilled, CloseCircleOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import { fetchHighlightFilter } from '@/services/highlight';
import type { HighlightFilter } from '@/services/highlight';
import { HIGHLIGHT_FILTER_LEAGUES, HIGHLIGHT_FILTER_TEAMS, REPORT_ACTION } from '@/constants';
import { FormattedMessage, useLocation } from 'umi';
import { report } from '@/services/ad';
import { getPageFromPath } from '@/utils/page-info';
import { checkIsPhone } from '@/utils/utils';
import { Modal} from 'antd'

function Header(props: {
  index: number;
  onClose?: () => void;
  onChange?: (index: number) => void;
}) {
  const isPhone = checkIsPhone();
  const { index, onChange, onClose } = props;
  const [tabLineX, setTabLineX] = useState('-100%');
  const tabRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tabs = ['key_choose_the_league', 'key_choose_the_team'];

  const setTabLinePos = (i: number) => {
    const el = tabRefs.current[i];
    if (!el) return;
    let pos = '';
    if (isPhone) {
      const { x, width } = el.getBoundingClientRect();
      pos = `${(x + width / 2)}px`;
    } else {
      pos = i === 0 ? '25%' : '75%';
    }

    setTabLineX(pos);
  };

  const handleTabClick = (i: number) => {
    setTabLinePos(i);
    onChange?.(i);
  };

  useEffect(() => {
    setTimeout(() => {
      setTabLinePos(index);
    });
  }, []);

  return <div className={styles.header}>
    {tabs.map((t, i) => <div
      className={styles.item}
      onClick={() => handleTabClick(i)}
      key={t}
    >
      <span
        ref={(ref) => {
              tabRefs.current[i] = ref
        }}
      ><FormattedMessage id={t} /></span>
    </div>)}
    <CloseCircleOutlined className={styles.close} onClick={onClose} />
    <div className={styles.line} style={{ left: tabLineX }} />
  </div>;
}

function Body(props: {
  index: number;
  teams: HighlightFilter[];
  leagues: HighlightFilter[];
  selectedTeamIds: number[];
  selectedLeagueIds: number[];
  onTeamsChange: (data: number[]) => void;
  onLeaguesChange: (data: number[]) => void;
}) {
  const {index, leagues, selectedLeagueIds, selectedTeamIds, teams, onTeamsChange, onLeaguesChange} = props;
  const list = [{
    data: leagues,
    key: 'leagues',
  }, {
    data: teams,
    key: 'teams',
  }] as const;
  const x = `${index * -100}%`;
  const handleClick = (key: 'teams' | 'leagues', data: HighlightFilter) => {
    const selected = key === 'teams' ? selectedTeamIds : selectedLeagueIds;
    const i = selected.indexOf(data.id);
    const newSelected = i > -1
      ? [
        ...selected.slice(0, i),
        ...selected.slice(i + 1)
      ]
      : [...selected, data.id];
    const cb = key === 'teams' ? onTeamsChange : onLeaguesChange;
    cb(newSelected);
  };
  return <div className={styles.body}>
    <div className={styles.bodyWrapper} style={{transform: `translateX(${x})`}}>
      {list.map((l) => <div className={styles.listScroller} key={l.key}>
        <div className={styles.list}>
          {l.data.map((d) => {
            const selected = l.key === 'teams' ? selectedTeamIds : selectedLeagueIds;
            const cls = selected.includes(d.id) ? styles.selected : '';
            return <div
              className={`${styles.item} ${cls}`}
              onClick={() => handleClick(l.key, d)}
              key={d.id}
            >
              <div
                className={styles.logo} style={{ backgroundImage: `url(${d.logo})` }} >
                <CheckCircleFilled className={styles.checkIcon} />
              </div>
              <div className={styles.name}>{d.name}</div>
            </div>;
          })}
        </div>
      </div>)}
    </div>
  </div>;
}

export const getPersistSelectedData = () => {
  let teams: number[] = [];
  let leagues: number[] = [];
  try {
    const teamIdStr = localStorage.getItem(HIGHLIGHT_FILTER_TEAMS);
    const leagueIdStr = localStorage.getItem(HIGHLIGHT_FILTER_LEAGUES);
    if (teamIdStr) {
      teams = JSON.parse(teamIdStr);
    }
    if (leagueIdStr) {
      leagues = JSON.parse(leagueIdStr);
    }
  } catch (e) {
    console.log('Error in getPersistSelectedData');
  }
  return { teams, leagues };
};

export const setPersistSelectedData = (data: {
  teams: number[];
  leagues: number[];
}) => {
  try {
    localStorage.setItem(HIGHLIGHT_FILTER_TEAMS, JSON.stringify(data.teams));
    localStorage.setItem(HIGHLIGHT_FILTER_LEAGUES, JSON.stringify(data.leagues));
  } catch (e) {
    console.log('Error in setPersistSelectedData');
  }
};

function keepReferenceIfNotModified(oldAry: number[], newAry: number[]) {
  const oldCopy = [...oldAry].sort();
  const newCopy = [...newAry].sort();
  const equal = oldCopy.length === newCopy.length &&
    JSON.stringify(oldCopy) === JSON.stringify(newCopy);
  return equal ? oldAry : newAry;
}

export default function LeagueTeamFilter(props: {
  selectedTeams: number[];
  selectedLeagues: number[];
  onChange?: (data: { teams: number[]; leagues: number[]; }) => void;
  onCancel?: () => void;
  visible?: boolean;
}) {
  const { visible, onChange, onCancel } = props;
  const [teams, setTeams] = useState<HighlightFilter[]>([]);
  const [leagues, setLeagues] = useState<HighlightFilter[]>([]);
  const [selectedTeamIds, setSelectedTeamIds] = useState<number[]>([]);
  const [selectedLeagueIds, setSelectedLeagueIds] = useState<number[]>([]);
  const [curIndex, setCurIndex] = useState(0);
  const location = useLocation();
  const path = location.pathname;
  // const [initialed, setInitialed] = useState(false);

  const handleReset = () => {
    setSelectedTeamIds([]);
    setSelectedLeagueIds([]);
    onChange?.({
      teams: keepReferenceIfNotModified(props.selectedTeams, []),
      leagues: keepReferenceIfNotModified(props.selectedLeagues, []),
    });
  };

  const handleConfirm = () => {
    if (selectedLeagueIds.length + selectedTeamIds.length === 0) return;
    onChange?.({
      teams: keepReferenceIfNotModified(props.selectedTeams, selectedTeamIds),
      leagues: keepReferenceIfNotModified(props.selectedLeagues, selectedLeagueIds),
    });
    const page = getPageFromPath(path);
    if (page) {
      report({
        cate: page.cate,
        action: REPORT_ACTION.highlight_filter_select,
      });
    }
  };

  const getData = async () => {
    const res = await fetchHighlightFilter();
    if (res.success) {
      // setInitialed(true);
      setTeams(res.data.team);
      setLeagues(res.data.competition);
    }
  };

  useEffect(() => {
    if (visible) {
      // if (!initialed) {
      //   getData();
      // }
      setSelectedTeamIds([...props.selectedTeams]);
      setSelectedLeagueIds([...props.selectedLeagues]);
    }
  }, [visible]);

  useEffect(() => {
    getData()
  }, []);

  const isPhone = checkIsPhone();

  return <Modal visible={visible} footer={null} closable={false} wrapClassName={styles.modal} centered>
    <div className={`${styles.wrapper} ${visible ? styles.show : ''}`}>
    {/* <div className={styles.bg} onClick={onCancel} /> */}
    <div className={`${styles.panel} ${!isPhone ? styles.pc : ''}`}>
      <Header index={curIndex} onChange={setCurIndex} onClose={onCancel} />
      <Body
        index={curIndex}
        teams={teams}
        leagues={leagues}
        selectedLeagueIds={selectedLeagueIds}
        selectedTeamIds={selectedTeamIds}
        onLeaguesChange={setSelectedLeagueIds}
        onTeamsChange={setSelectedTeamIds}
      />
      <div className={styles.btns}>
        <div className={styles.btn} onClick={handleReset}>
          <FormattedMessage id='key_reset' />
        </div>
        <div
          className={`${styles.btn} ${styles.confirm} ${selectedLeagueIds.length + selectedTeamIds.length === 0 ? styles.disabled : ''}`}
          onClick={handleConfirm}
        >
          <FormattedMessage id='key_selected' />
          {selectedLeagueIds.length + selectedTeamIds.length > 0 ? `(${selectedLeagueIds.length + selectedTeamIds.length})` : ''}
        </div>
      </div>
    </div>
  </div>
  </Modal>
}
