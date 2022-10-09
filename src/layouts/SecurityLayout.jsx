import React, { useState, useEffect } from 'react';
import { ConnectProps, isBrowser, Helmet, useDispatch } from 'umi';
import { connect, isBo } from 'umi';
import { checkIsPhone } from '@/utils/utils';
import titleJson from './title';
import { ConfigProvider } from 'antd';
import { locale } from '@/app';
import ar_EG from 'antd/lib/locale/ar_EG';
import ja_JP from 'antd/lib/locale/ja_JP';
import ko_KR from 'antd/lib/locale/ko_KR';
import vi_VN from 'antd/lib/locale/vi_VN';
import zh_CN from 'antd/lib/locale/zh_CN';
import pageConfig from '@/utils/pageConfig';
const TitleAndKeyWords = ({ pathname }) => {
  const obj =
    titleJson[
      pathname
        .split('/')
        .filter((e) => e)
        .join('.')
    ];
  const title = obj?.title || pageConfig.title;
  const keywords = obj?.desc || obj?.keywords || pageConfig.keywords;
  const desc = obj?.desc || pageConfig.keywords.desc;

  return (
    <Helmet encodeSpecialCharacters={false}>
      <title>{`${title}`}</title>
      <meta name="keywords" content={`${keywords}`} />
      <meta name="description" content={`${desc}`} />
      <link rel="icon" href={`${pageConfig.ico}`} type="image/x-icon" />
    </Helmet>
  );
};

const SecurityLayout = (props) => {
  const langMap = {
    ar: ar_EG,
    ja: ja_JP,
    ko: ko_KR,
    vi: vi_VN,
    zh: zh_CN,
  };
  const [isReady, setReady] = useState(false);
  const dispatch = useDispatch();

  if (global) {
    global.pathname = props.location.pathname;
  }
  const { loading, user, children } = props;
  useEffect(() => {
    dispatch({
      type: 'user/fetchCurrent',
    });
    setReady(true);
  }, []);
  return (
    <ConfigProvider direction="ltr" locale={langMap[locale.getLocale()]}>
      <div className='h-full'>
        <TitleAndKeyWords pathname={props.location.pathname} />
        {/* {isReady ? <>{children}</> : <div style={{ display: 'none' }}></div>} */}
        <div className='h-full' style={!isReady ? { display: 'none' } : {}}>{children}</div>
      </div>
    </ConfigProvider>
  );
};

export default connect(({ user, loading }) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
