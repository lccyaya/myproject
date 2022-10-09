import request from '@/utils/request';
import { normalizeResponse } from '@/utils/tools';

export type FetchNewsListParams = {
  page: number;
  size: number;
  favorite?: boolean;
  published_time?: string;
  match_id?: number;
}

export type FetchCommentListParams = {
  news_id: number;
  parent_id?: number;
  first_child_comment_id?: number;
  page: number;
  size: number;
  asc?: boolean;
}

export type NewsComment = {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  user_id: number;
  news_id: number;
  parent_id: number;
  reply_to_user: number;
  reply_to_comment: number;
  support: number;
  words: string;

  user_pic: string;
  user_name: string;
  reply_to_user_name: string;
  remain_child_comment_count: number;
  child_first_comment: NewsComment | null;
}

export type News = {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  source: number;
  source_id: string;
  source_published_at: string;
  source_lang: string;
  title: string;
  description: string;
  cover_img_url: string;
  content: string;
  is_deleted: boolean;
  source_link: string;
  support: number;
  un_support: number;
  is_top: boolean;
  visit: number;
  is_favorite: boolean;
  detail_url: string;
  comment_count: number;
}

export type TopInfo = {
  cover_img_url: string;
  title: string;
  // 0-资讯 1-集锦
  type: 0 | 1;
  visit: number;
  support: number;
  play_url: string;
  backup_play_url: string;
  id: number;
};

export type LeagueNews = {
  competition_name: string;
  competition_id: number;
  competition_logo: string;
  'background-url': string;
  news: News[];
}

export async function fetchLatestInfo(params?: {
  page: number;
  size: number;
}) {
  const result = await request('/api/home/news/latest', { params });
  return normalizeResponse<TopInfo[]>(result);
}

export async function fetchTopInfo() {
  const result = await request('/api/home/hot-info');
  return normalizeResponse<TopInfo[]>(result);
}

export async function fetchLeagueNews(size = 5) {
  const result = await request('/api/home/competition/news', { params: { size } });
  return normalizeResponse<LeagueNews[]>(result);
}

export async function fetchNewsList(params: FetchNewsListParams) {
  const result = await request('/api/news', { params });
  return normalizeResponse<{ news: News[]; total: number; }>(result);
}

export async function fetchHotNewsList() {
  const result = await request('/api/news/hot');
  return normalizeResponse<News[]>(result);
}

export async function visitNews(id: number) {
  const result = await request('/api/news/visit', {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });
  return normalizeResponse<Record<string, never>>(result);
}

export async function getNews(id: number) {
  const result = await request('/api/news/detail', { params: { id } });
  return normalizeResponse<News>(result);
}

export async function fetchCommentList(params: FetchCommentListParams) {
  const result = await request('/api/news/comments', { params });
  return normalizeResponse<{
    comments: NewsComment[] | null;
    comments_count: number;
    total: number;
  }>(result);
}

export async function comment(params: {
  news_id: number;
  words: string;
  comment_id?: number;
}) {
  const result = await request('/api/news/comment', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  return normalizeResponse<{
    comment: Omit<NewsComment, 'user_pic' | 'user_name' | 'reply_to_user_name' | 'remain_child_comment_count' | 'child_first_comment'>,
    comments_count: number;
  }>(result);
}

export async function supportNews(props: {
  id: number;
  support: boolean;
}) {
  const result = await request('/api/news/support', {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(props),
  });
  return normalizeResponse<Record<string, never>>(result);
}

export async function supportComment(props: {
  id: number;
  support: boolean;
}) {
  const result = await request('/api/news/comment-support', {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(props),
  });
  return normalizeResponse<Record<string, never>>(result);
}
