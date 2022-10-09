// @ts-nocheck
import React, { useEffect, useState, useMemo } from 'react';
import { Menu } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import { getLocale, setLocale, addLocale } from 'umi';
import classnames from 'classnames';
import styles from './index.less';
import { report } from '@/services/ad';
import { REPORT_ACTION, REPORT_CATE, SESS_STORAGE_REFRESH_FCM_TOKEN } from '@/constants';
import { toShortLangCode } from '@/utils/utils';
import { refreshMessageToken } from '@/services/notification';
import HeaderDropdown from '@/components/HeaderDropdown';
import { getLanguages, getLanguageContent } from '@/services/language';
import build_time from '@/build_time';
interface SelectLangProps {
  globalIconClassName?: string;
  onItemClick?: (params: ClickParam) => void;
  className?: string;
  reload?: boolean;
}

const defaultLangUConfigMap = {
  ar: {
    lang: 'ar',
    label: 'العربية',
    icon: '🇪🇬',
  },
  id: {
    label: 'Bahasa Indonesia',
    lang: 'id',
    icon: '🇮🇩',
  },
  ms: {
    label: 'Bahasa Melayu',
    lang: 'ms',
    icon: '🇲🇾',
  },
  vi: {
    label: 'Tiếng Việt',
    lang: 'vi',
    icon: '🇻🇳',
  },
  ko: {
    label: '한국어',
    lang: 'ko',
    icon: '🇰🇷',
  },
  ja: {
    label: '日本語',
    lang: 'ja',
    icon: '🇯🇵',
  },
  es: {
    label: 'Español',
    lang: 'es',
    icon: '🇪🇸',
  },
  pt: {
    label: 'Português',
    lang: 'pt',
    icon: '🇵🇹',
  },
  'en-US': {
    label: 'English',
    lang: 'en-US',
    icon: '🇺🇸',
  },
  th: {
    label: 'ไทย',
    lang: 'th',
    icon: '🇹🇭',
  },
  'zh-CN': {
    lang: 'zh-CN',
    label: '简体中文',
    icon: '🇨🇳',
  },
};

const SelectLang: React.FC<SelectLangProps> = (props) => {
  const { globalIconClassName, onItemClick, style, reload, ...restProps } = props;
  const selectedLang = getLocale();
  const [selectVisible, setSelectVisible] = useState<boolean>(false);
  const [allLocales, setAllLocales] = useState([]);

  const checkRefreshFcmToken = () => {
    const refresh = sessionStorage.getItem(SESS_STORAGE_REFRESH_FCM_TOKEN);
    if (refresh) {
      sessionStorage.setItem(SESS_STORAGE_REFRESH_FCM_TOKEN, '');
      refreshMessageToken();
    }
  };
  const getSupportLang = async () => {
    const result = await getLanguages();
    if (result.success) {
      const codes = result.data.map((item) => {
        return item.code;
      });
      setAllLocales(result.data);
      const resp = await getLanguageContent({
        codes,
        time: build_time.time || 0,
      });
      if (resp.success) {
        const data = resp.data || [];
        for (const key in data) {
          addLocale(key, data[key], {
            momentLocale: key,
            antd: key,
          });
        }
      }
    }
  };
  useEffect(() => {
    getSupportLang();
    const handler = () => {
      setSelectVisible(false);
    };
    window.addEventListener('click', handler);
    checkRefreshFcmToken();
    return () => {
      window.removeEventListener('click', handler);
    };
  }, []);

  const changeLang = async ({ key }: ClickParam): void => {
    console.log('切换语言', key);
    localStorage.setItem('umi_locale', key);
    setLocale(key, false);
    sessionStorage.setItem(SESS_STORAGE_REFRESH_FCM_TOKEN, '1');
    const lang = toShortLangCode(key);
    const path = `/${lang}${window.location.pathname.replace(/^\/[^/]+/, '')}`;
    const { search } = window.location;
    // history.replace(`${path}${search}`);
    location.href = `${path}${search}`;
  };

  const allLangUIConfig = allLocales.map((item) => {
    return {
      lang: item.code,
      label: item.name,
      icon: item.logo || defaultLangUConfigMap[item.code]?.icon || '🌐',
      title: item.code,
    };
  });
  const curLang = useMemo(() => {
    const result = allLangUIConfig.find((item) => {
      return item.lang === selectedLang;
    });
    return result?.icon;
  }, [allLangUIConfig, selectedLang]);
  const handleClick = onItemClick ? (params: ClickParam) => onItemClick(params) : changeLang;

  const menuItemStyle = { minWidth: '160px' };
  const menuItemIconStyle = { marginRight: '8px' };
  const langMenu = (
    <Menu selectedKeys={[selectedLang]} onClick={handleClick}>
      {allLangUIConfig.map((localeObj) => {
        return (
          <Menu.Item
            key={localeObj.lang || localeObj.key}
            style={menuItemStyle}
            onClick={() => {
              const name = { 'en-US': 'en', 'zh-CN': 'zh_CN' }[localeObj.lang] || localeObj.lang;
              report({
                cate: REPORT_CATE.me,
                action: REPORT_ACTION.me_select_lang + name,
              });
            }}
          >
            <span role="img" aria-label={localeObj?.label || 'en-US'} style={menuItemIconStyle}>
              {localeObj?.icon || '🌐'}
            </span>
            {localeObj?.label || 'en-US'}
          </Menu.Item>
        );
      })}
    </Menu>
  );

  const inlineStyle = {
    // cursor: "pointer",
    // padding: "12px",
    // display: "inline-flex",
    // alignItems: "center",
    // justifyContent: "center",
    // fontSize: 18,
    // verticalAlign: "middle",
    ...style,
  };
  return (
    <HeaderDropdown
      visible={selectVisible}
      overlay={langMenu}
      placement="bottomRight"
      {...restProps}
      getPopupContainer={(trigger) => trigger.parentNode}
    >
      <span
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setSelectVisible(!selectVisible);
          report({
            cate: REPORT_CATE.me,
            action: REPORT_ACTION.me_change_lang,
          });
        }}
        className={classnames(globalIconClassName, styles.wrapper)}
        style={inlineStyle}
      >
        <span className={styles.title}>{curLang}</span>
        <CaretDownOutlined className={styles.icon} />
      </span>
    </HeaderDropdown>
  );
  return <></>;
};

export default SelectLang;
