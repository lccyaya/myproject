import clipboardy from 'clipboardy';
import axios from 'axios';

setInterval(() => {
  let v = clipboardy.readSync();
  if (v.indexOf('F:') === 0) {
    clipboardy.writeSync('');
    axios({
      url: 'http://language.34.com/api/admin/language/translation',
      method: 'POST',
      data: {
        project_id: 1,
        translation: { enus: v.replace('F:', '') },
        platform_ids: [3],
        page: 1,
        size: 10,
      },
    }).then((e) => {
      console.log('接口返回', e);
      if (e && e.data && e.data.code === 0) {
        const languages = e.data.data.list || [];
        let list = languages.map((item) => {
          return {
            code: `intl.formatMessage({id: "${item.key}",defaultMessage: "${item.key}"})`,
            en: item.enus,
            zh: item.zhcn,
          };
        });
        if (languages.length === 0) {
          console.log(`多语言: 单词[${v.replace(
            'F:',
            '',
          )}] [PC端] 翻译缺失[007项目]`)
        } else if (languages.length === 1) {
          console.log('已经帮您复制到剪贴板', list[0].en, list[0].zh);
          clipboardy.writeSync(list[0].code);
        } else {
          console.log('已经帮您复制到剪贴板,但是多语言文件有多个，请选择正确的');
          clipboardy.writeSync(list.map((item) => item.code + '-' + item.en).join('\n'));
        }
      } else {
        console.log('接口出现错误');
      }
    });
    // search(v.replace('F:', '')).then()
  }
}, 1000);
