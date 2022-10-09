import { checkIsPhone, isForChina, toShortLangCode } from '@/utils/utils';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'umi';
import { locale } from '@/app';
import { parse } from 'query-string';

const RediectPage = () => {
  const [language, setLanguage] = useState('');
  const history = useHistory();

  useEffect(() => {
    const _language = locale.getLocale();
    console.log('当前的语言是===>', _language);
    setLanguage(_language);
  }, []);
  useEffect(() => {
    const query = parse(window?.location.search);
    if (language) {
      const lang = toShortLangCode(language);
      if (query.code) {
        history.push(`/${lang}/home?code=${query.code}`);
      } else {
        history.push(`/${lang}/home`);
      }
    }
  }, [language]);
  return <div />;
};

export default RediectPage;
