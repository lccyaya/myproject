// import request from '@/utils/request';
import { feedBackRequest } from '@/utils/request';
import { normalizeResponse } from '@/utils/tools';
export type FeedbackCategory = {
  id: number;
  content: string;
}

export async function getFeedbackCategory(project: string) {
  const result = await feedBackRequest('/api/v1/feedback/category', {
    method: 'GET',
    params: { project },
  });
  return normalizeResponse<FeedbackCategory[]>(result);
}

export async function updateFeedbackQuestion(data: {project: string, category_id: number, description: string, images?: string[], email?: string}) {
  const result = await feedBackRequest('/api/v1/feedback/question', {
    method: 'POST',
    data,
  });
  return normalizeResponse<FeedbackCategory[]>(result);
}