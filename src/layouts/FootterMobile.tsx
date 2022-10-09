import { locale } from '@/app';
import IconFont from '@/components/IconFont';
import { pageRegex } from '@/utils/page-info';
import { toShortLangCode } from '@/utils/utils';
import { TabBar } from 'antd-mobile';
import { useEffect, useState } from 'react';
import { useHistory, useIntl } from 'umi';

const FooterMobile: React.FC = () => {
  const allNavs = [
    {
      key: 'home',
      pathRegex: pageRegex.get('home'),
      path: '/home',
      locale: 'key_home_tab',
      icon: (active: boolean) => (
        <IconFont type={active ? 'icon-shouye-dianji' : 'icon-shouye'} size={22} />
      ),
    },
    {
      key: 'live',
      pathRegex: pageRegex.get('live'),
      path: '/live',
      locale: 'key_spot',
      icon: (active: boolean) => (
        <IconFont type={active ? 'icon-saizhi-dianji' : 'icon-saizhi'} size={22} />
      ),
    },
    {
      key: 'match',
      pathRegex: pageRegex.get('match'),
      path: '/match',
      locale: 'key_match',
      icon: (active: boolean) => (
        <IconFont type={active ? 'icon-saizhi-dianji' : 'icon-saizhi'} size={22} />
      ),
    },
    {
      key: 'expert',
      pathRegex: pageRegex.get('expert'),
      path: '/expert',
      locale: 'key_expert',
      icon: (active: boolean) => (
        <IconFont type={active ? 'icon-zhuanjia-dianji' : 'icon-zhuanjia'} size={22} />
      ),
    },
  ];
  const formatMsg = useIntl().formatMessage;

  const lang = toShortLangCode(locale.getLocale());
  const history = useHistory();
  const [curKey, setCurKey] = useState('');

  const handleTabClick = (key: string) => {
    setCurKey(key);
    const cur = allNavs.find((n) => n.key === key);
    if (cur) {
      history.push({
        pathname: `/${lang}${cur.path}`,
      });
    }
  };

  useEffect(() => {
    const nav = allNavs.find((n) => {
      return n.pathRegex!.test(location.pathname);
    });
    setCurKey(nav?.key ?? '');
  }, [location.pathname]);

  return (
    <TabBar activeKey={curKey} onChange={handleTabClick}>
      {allNavs.map((item) => (
        <TabBar.Item key={item.key} title={formatMsg({ id: item.locale })} icon={item.icon} />
      ))}
    </TabBar>
  );
};

export default FooterMobile;
