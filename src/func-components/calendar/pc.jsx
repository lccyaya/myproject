import React, { useState, createRef, useEffect, useMemo } from 'react';
import styles from './pc.module.less';
import cls from 'classnames';
import { Calendar, Badge } from 'antd';
import moment from 'moment';
import { useIntl } from 'umi';
import IconFont from '@/components/IconFont';
import { formatDateMMMYYYY } from '@/utils/utils';
import { getCalendar } from '@/services/matchPage';
// value={calendarValue} setValue={setCalendarValue}
const CalendarCom = ({ 
  className, show, onChange = () => {}, onClose = () => {}, params = {},
  value, setValue,
}) => {
  const intl = useIntl();
  const [data, setData] = useState({});
  const [realValue, setRealValue] = useState(moment());
  const { param_value } = params;

  // 获取日历信息
  const getCalendarData = async (value) => {
    const month = value.format('YYYY-MM');
    setData({});
    const query = {
      zone: params.zone,
      [params.param_key]: param_value,
      month,
    }
    if (params.competition_ids?.length) { query.competition_ids = params.competition_ids }
    const { data = {} } = await getCalendar(query);
    data.month = month;
    setData(data);
  };

  const onDateChange = (type) => {
    let [year, month, day] = value.format('YYYY-MM-DD').split('-');
    year = +year;
    month = +month;
    day = +day;
    if (type === 'prev') {
      if (month === 1) {
        month = month = 12;
        year -= 1;
      } else {
        month = month - 1;
      }
    } else {
      if (month === 12) {
        month = 1;
        year += 1;
      } else {
        month = month + 1;
      }
    }
    const lastDay = moment(year + '-' + month)
      .endOf('month')
      .format('DD');
    day = day > +lastDay ? lastDay : day;
    setValue(moment(year + '-' + month + '-' + day));
    getCalendarData(moment(year + '-' + month + '-' + day)); // 重新获取数据
  };

  const dateCellRender = (value) => {
    const day = value.date();
    let info = data[day] || null;
    return info && info.match_num ? (
      <div className={styles.label}>
        {info.match_num}
        {info.contains_subscribe ? (
          <IconFont className={styles.star} type="icon-shoucang1" size={15} />
        ) : null}
      </div>
    ) : null;
  };

  // 自定义头部组件
  const HeaderCom = () => {
    const time = formatDateMMMYYYY(value / 1000);
    // moment(date * 1000).format('MMM,MM/DD YYYY');
    return (
      <>
        <div className={styles.header}>
          <span
            className={styles.today}
            onClick={() => {
              onSelect(moment());
            }}
          >
            <IconFont className={styles.arrow} type="icon-jiantouzuo" size={12} />
            {intl.formatMessage({ id: 'key_today', defaultMessage: 'key_today' })}
          </span>
          <h5>
            {intl.formatMessage({ id: 'key_match_calendar', defaultMessage: 'key_match_calendar' })}
          </h5>
          <IconFont
            onClick={onClose}
            className={styles.close}
            type="icon-yuanquanguanbi"
            size={20}
          />
        </div>
        <div className={styles.switch}>
          <IconFont
            className={styles.switch_icon}
            onClick={() => onDateChange('prev')}
            type="icon-jiantouzuo"
            size={20}
          />
          
          <span>{time}</span>
          <IconFont
            className={styles.switch_icon}
            onClick={() => onDateChange('next')}
            type="icon-jiantouyou"
            size={20}
          />
        </div>
      </>
    );
  };

  // 是否有选中的样式 切到其它月份时，是不能选中的
  const noActive = useMemo(() => {
    if (realValue.format('MM') !== value.format('MM')) { return styles.noActive; }

    // 是否没有任何一天有数据
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      if (data[keys[i]].match_num > 0) {
          return null;
      }
    }
    return styles.noActive;
  }, [realValue, value, data]);

  useEffect(() => {
    if (show === true) {
      setRealValue(value);
      getCalendarData(value);
    } else {
      setTimeout(() => {
        setValue(realValue);
      }, 300); // 渐隐动画消失了在处理
    }
  }, [show]);

  // 表示切换了左侧菜单，需要初始化
  useEffect(() => {
    setValue(moment());
  }, [param_value]);

  const onSelect = (v) => {
    onChange(v);
    setValue(moment(v.format('YYYY-MM-DD')));
    setRealValue(moment(v.format('YYYY-MM-DD')));
  };

  return (
    <div className={cls(styles.calender, show ? styles.show : null, className, noActive)}>
      <i className={styles.bg} onClick={onClose}></i>
      <div className={styles.box}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <Calendar
          value={value}
          dateCellRender={dateCellRender}
          fullscreen={false}
          headerRender={HeaderCom}
          disabledDate={(current) => {
            const day = current.date();
            let info = data[day] || null;
            if (info?.match_num === 0) {
              return true;
            }
            if (params.param_value === 3) {
              return current > moment().startOf('day');
            }
            if (params.param_value === 2) {
              return current < moment().subtract(1, 'days');
            }
            return false;
          }}
          onSelect={onSelect}
        />
        {/* 提示 */}
        <div className={styles.tip}>
          <IconFont className={styles.tip_icon} type="icon-shoucang1" size={16} />
          {intl.formatMessage({
            id: 'key_have_followed_matches',
            defaultMessage: 'key_have_followed_matches',
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarCom;
