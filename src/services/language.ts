import {langRequest} from '@/utils/request';
import { normalizeResponse } from '@/utils/tools';
type IParam = {
  project_id?: number;
  codes: string[],
  time: number
}
// 获取项目已经支持的语言
export const getLanguages = async () => {
  const result = await langRequest('/api/v1/language/support?project_id=1');
  return normalizeResponse<{}>(result);
};

// 获获取多语言内容
export const getLanguageContent = async (params: IParam) => {
  const result = await langRequest('/api/v1/language/translation', {
    method: 'POST',
    data: {...params, project_id: 1}
  });
  return normalizeResponse<{}>(result);
};
