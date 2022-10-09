import { defineConfig } from 'umi';

export default defineConfig({
  publicPath: '/',
  plugins: [
    'react-dev-inspector/plugins/umi/react-inspector',
  ],
  inspectorConfig: {
    exclude: [],
    babelPlugins: [],
    babelOptions: {},
  },
  chainWebpack(config) {
  },
});
