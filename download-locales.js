const fs = require('fs');
const axios = require('axios');
const moment = require('moment');

const getBuildParamWithDefault = (arg, defaultValue = '') => {
  const target = process.argv.find((x) => x.indexOf(`--${arg}`) > -1);
  let ret = defaultValue;
  if (target && target.indexOf('=') > 0) {
    [, ret] = target.split('=');
  }

  return ret;
};

const REACT_APP_ENV = getBuildParamWithDefault('env', 'dev');
console.log(`当前的环境是${REACT_APP_ENV}`);
const instance = axios.create({
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'accept-language': 'en-US',
    'x-platform': 'PC',
    'x-zone': -new Date().getTimezoneOffset() / 60,
    'x-device-id': '111',
  },
});
const getAllLanguages = async () => {
  const {
    data: { data },
  } = await instance.get('http://language.34.com/api/v1/language/support', {
    params: {
      timestamp: parseInt(String(new Date().getTime() / 1000)),
      project_id: 1,
    },
  });
  const languages = data.map((item) => {
    return item.code;
  });
  if (languages.length > 0) {
    console.log(languages);
    await getLanguage(languages);
  }
};

/**
 * 获取多语言内容
 * @returns
 */

const getLanguage = async (languages) => {
  const {
    data: { data },
  } = await instance.post('http://language.34.com/api/v1/language/translation', {
    timestamp: parseInt(String(new Date().getTime() / 1000)),
    codes: languages,
    time: 0,
    project_id: 1,
  });

  for (const key in data) {
    fs.writeFileSync(
      `./src/locales/${key}.ts`,
      'export default ' + JSON.stringify(data[key], 2, ' ') + '',
    );
  }
};

const main = async () => {
  await getAllLanguages();
  fs.writeFileSync(`./src/build_time.js`, `export default {time: ${moment().unix()}}`);
};
main();
