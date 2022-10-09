// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

const { REACT_APP_ENV, DEPLOY_TARGET } = process.env;
console.log('环境变量', REACT_APP_ENV, process.env)

const prodPublicPath = '//www.007sport.app/';
const testPublicPath = '//dev.football-master.net/';


export default defineConfig({
  publicPath: '//www.34sport.com.cn/',
  hash: true,
  exportStatic: {
    extraRoutePaths: async () => {
      const buildRoute = (array: any) => {

        let languages = ['ar', 'en', 'id', 'ja', 'ko', 'ms', 'pt', 'th', 'vi', 'zh']
        if (DEPLOY_TARGET === 'cn') {
          languages = ['zh']
        }
        const result = []
        for (let j = 0; j < languages.length; j++) {
          for (let i = 0; i < array.length; i++) {
            result.push("/" + languages[j] + '/' + array[i])
          }
        }
        return result
      }
      return Promise.resolve(buildRoute(['home', 'highlight', 'news', 'live', 'match', 'tips', 'info', 'download']));
    },
  },
  devtool: false,
  define: {
    REACT_APP_ENV: REACT_APP_ENV,
    DEPLOY_TARGET: DEPLOY_TARGET,
  },
  ssr: {
    mode: 'string',
    devServerRender: true
  },
  antd: { mobile: false },
  dva: {
    hmr: true,
  },
  history: {
    type: 'browser',
  },
  locale: {
    baseNavigator: false,
    useLocalStorage: false,
    default: 'en-US',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    // baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy['dev'],
  manifest: {
    basePath: '/',
  },
  esbuild: {},
  devServer: {
    // https: {
    //   key: './config/cert/localhost-key.pem',
    //   cert: './config/cert/localhost.pem',
    // },
  },
  chainWebpack(config) {
    config.module
      .rule('less')
      .oneOf('css')
      .use('postcss-loader')
      .loader('postcss-loader')
      .end();
  },
  extraPostCSSPlugins: [
    require('postcss-px-to-viewport')({
      viewportWidth: 375, // 视窗的宽度，对应的是我们设计稿的宽度，一般是 375
      unitPrecision: 3, // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
      viewportUnit: 'vw', // 指定需要转换成的视窗单位，建议使用 vw
      selectorBlackList: [], // 指定不转换为视窗单位的类，可以自定义，可以无限添加，建议定义一至两个通用的类名
      minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
      mediaQuery: false, // 允许在媒体查询中转换`px`
      exclude: [
        /node_modules/,
        /index.module.less/,
        /pc.module.less/,
        /index.less/,
        /.global.less/,
        /default.less/,
        /theme.less/,
        /Welcome.less/,
        /MobileLayout.less/,
        /BasicLayout.less/,
        /color.less/,
        /NoticeList.less/,
        /UserLayout.less/,
        /highlight.less/,
        /hot-news.less/,
        /league-team-filter.less/,
        /league-news.less/,
        /major-match.less/,
        /top-recommend.less/,
        /major-match.less/,
        /match.less/,
        /header.less/,
        /top.less/,
        /mobile.module.less/,
        /mobile.less/,
      ], // 设置忽略转换的文件夹目录
    }),
  ],
  extraBabelPresets: [
    [
      "@babel/preset-env",
      {
        "targets": {
          "chrome": "49",
          "ios": "10"
        }
      }
    ]
  ]
});
