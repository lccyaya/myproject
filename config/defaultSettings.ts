import { Settings as ProSettings } from '@ant-design/pro-layout';

type DefaultSettings = Partial<ProSettings> & {
  pwa: boolean;
};

const proSettings: DefaultSettings = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#FA5900',
  layout: 'top',
  contentWidth: 'Fixed',
  fixedHeader: false,
  fixSiderbar: false,
  colorWeak: false,
  menu: { locale: true },
  pwa: false,
  iconfontUrl: undefined,
};

export type { DefaultSettings };

export default proSettings;
