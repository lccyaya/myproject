import { getReportCate } from '@/utils/utils';
import { report } from '@/services/ad';
export const handleReport = ({ action, tag, cate }) => {
  console.log('埋点开始 --------------------------');
  console.log('埋点数据:cate: ' + getReportCate(), 'action: ' + action, 'tag:' + tag);
  console.log('埋点结束 --------------------------');
  report({ cate: cate || getReportCate(), action, tag: tag + '' });
};
