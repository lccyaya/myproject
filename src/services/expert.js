import request from '@/utils/request';
import { normalizeResponse } from '@/utils/tools';
import qs from 'query-string';

// 获取方案详情
export const schemeDetail = async (params) => {
  const result = await request('/api/expert/scheme-detail?' + qs.stringify(params));
  return normalizeResponse(result);
};
// 获取方案分析 HTML 文本
export const schemeAnalyseText = async (params) => {
  const result = await request('/api/expert/analyse-text?' + qs.stringify(params));
  return normalizeResponse(result);
};

// 获取专家榜单
export const getExpertRanking = async (params) => {
  const result = await request('/api/expert/ranking-list?' + qs.stringify(params));
  return normalizeResponse(result);
};

// 获取专家榜单
export const getHotExpert = async (params) => {
  const result = await request('/api/v5/expert/hot-list', { params: params });
  return normalizeResponse(result);
};

// 获取方案列表
export const getSchemeList = async (params) => {
  const result = await request('/api/expert/scheme-list?' + qs.stringify(params));
  return normalizeResponse(result);
};
// 获取方案列表
export const getV5SchemeList = async (params) => {
  const result = await request('/api/v5/expert/scheme-list', { params });
  return normalizeResponse(result);
};

// 获取免费方案列表
export const getFreeSchemeList = async (params) => {
  const result = await request('/api/v5/expert/free-list', { params });
  return normalizeResponse(result);
};

// 获取赛事优选
export const recommendMatches = async (params) => {
  const result = await request('/api/expert/recommend-matches', {
    method: 'POST',
    data: params,
  });
  return normalizeResponse(result);
};

// 获取关注专家列表
export const followedList = async (params) => {
  const result = await request('/api/expert/followed-list?' + qs.stringify(params));
  return normalizeResponse(result);
};

// 赛事优选联赛选项
export const competitionList = async () => {
  const result = await request('/api/expert/competition-list');
  return normalizeResponse(result);
};

// 专家详情
export const expertDetail = async (params) => {
  const result = await request('/api/v1/expert/detail?' + qs.stringify(params));
  return normalizeResponse(result);
};
// 关注
export const expertFollow = async (params) => {
  const result = await request('/api/expert/follow?' + qs.stringify(params));
  return normalizeResponse(result);
};
// 取消关注
export const expertUnFollow = async (params) => {
  const result = await request('/api/expert/unfollow?' + qs.stringify(params));
  return normalizeResponse(result);
};

// 专家擅长联赛
export const getExpertSkilledCompetition = async (params) => {
  const result = await request('/api/v1/expert/skilled-competition?' + qs.stringify(params));
  return normalizeResponse(result);
};

// 联赛推荐专家
export const getRecommendExperts = async (params) => {
  const result = await request('/api/expert/recommend-experts?' + qs.stringify(params));
  return normalizeResponse(result);
};

//比赛详情页方案列表
export const getMatchSchemes = async (params) => {
  const result = await request('/api/expert/match-schemes?' + qs.stringify(params));
  return normalizeResponse(result);
};

//比赛比分
export const getMatchScore = async (params) => {
  const result = await request('/api/expert/match-score?' + qs.stringify(params));
  return normalizeResponse(result);
};

//优惠券列表
export const getCouponList = async (params) => {
  const result = await request('/api/coupon?' + qs.stringify(params));
  return normalizeResponse(result);
};

//用户订单
export const getUserOrder = async (params) => {
  const result = await request('/api/user/scheme-doc?' + qs.stringify(params));
  return normalizeResponse(result);
};

//交易记录
export const getUserTradeRecord = async (params) => {
  const result = await request('/api/user/doc?' + qs.stringify(params));
  return normalizeResponse(result);
};

//方案收藏、取消收藏
export const collectScheme = async (params) => {
  const result = await request('/api/scheme/collect', {
    method: 'POST',
    data: params,
  });
  return normalizeResponse(result);
};

//收藏方案列表
export const getCollectList = async (params) => {
  const result = await request('/api/scheme/collect-list?' + qs.stringify(params));
  return normalizeResponse(result);
};

//获取充值方案
export const getCoinScheme = async (params) => {
  const result = await request('/api/coin/scheme?' + qs.stringify(params));
  return normalizeResponse(result);
};

//金币充值
export const coinCharger = async (params) => {
  const result = await request('/api/coin/charger', {
    method: 'POST',
    data: params,
  });
  return normalizeResponse(result);
};

//方案收藏、取消收藏
export const toggleCollect = async (params) => {
  const result = await request('/api/scheme/collect', {
    method: 'POST',
    data: params,
  });
  return normalizeResponse(result);
};

//金币购买方案
export const buyScheme = async (params) => {
  const result = await request('/api/scheme/buy', {
    method: 'POST',
    data: params,
  });
  return normalizeResponse(result);
};

//金币购买方案
export const getRecommendCoupon = async (params) => {
  const result = await request('/api/coupon-recommend', {
    method: 'GET',
    params,
  });
  return normalizeResponse(result);
};

//轮询订单支付状态
export const getDocPayStatus = async (params) => {
  const result = await request('/api/scheme/doc-status?' + qs.stringify(params));
  return normalizeResponse(result);
};

//专家申请
export const applicationExpert = async (params) => {
  const result = await request('/api/v5/expert/add', {
    method: 'POST',
    data: params,
  });
  return normalizeResponse(result);
};
