import { Button, Result } from 'antd';
import React from 'react';
import { history, useIntl } from 'umi';
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';

const NoFoundPage: React.FC = () => {
  const intl = useIntl()
  return (
    <Result
      status="404"
      title="404"
      subTitle={intl.formatMessage({id: "key_page_not_exist"})}
      extra={
        <Button
          type="primary"
          onClick={() => {
            const lang = toShortLangCode(locale.getLocale());
            history.push(`/${lang}/home`);
          }}
        >
          {intl.formatMessage({id: "key_back_home"})}
        </Button>
      }
    />
  );
};

export default NoFoundPage;
