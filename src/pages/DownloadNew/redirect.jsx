import { checkIsPhone, toShortLangCode } from '@/utils/utils';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'umi';
import { locale } from '@/app';
import { parse } from 'query-string';

const RediectPage = () => {
  const [language, setLanguage] = useState('');

  const history = useHistory();

  useEffect(() => {
    const _language = locale.getLocale();
    setLanguage(_language);
    console.log('当前的语言是===>', _language);
  }, []);
  useEffect(() => {
    if (language) {
      const lang = toShortLangCode(language);
      history.push(`/${lang}/download/` + window?.location?.search);
    }
  }, [language]);
  return <div />;
};

export default RediectPage;
