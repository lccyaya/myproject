// 0 全部、1 让球、2 胜平负、3 胜负过关、4 上下单双
export const PLAY_STATUS = ((ENUM) => {
  ENUM[(ENUM.ALL = 0)] = '全部';
  ENUM[(ENUM.RQ = 1)] = '让球';
  ENUM[(ENUM.SPF = 2)] = '胜平负';
  ENUM[(ENUM.SFGG = 3)] = '胜负过关';
  ENUM[(ENUM.SXDS = 4)] = '上下单双';
  return ENUM;
})({});

export const PLAY_TYPE = ((ENUM) => {
  ENUM[(ENUM.JC = 1)] = '竞彩';
  ENUM[(ENUM.BD = 2)] = '北单';
  return ENUM;
})({});

// 0 待上线、1 在售、2 停售、3 命中、4 未中
export const SCHEME_STATE = ((ENUM) => {
  ENUM[(ENUM.WAIT = 0)] = '待上线';
  ENUM[(ENUM.SALE = 1)] = '在售';
  ENUM[(ENUM.STOP_SALE = 2)] = '停售';
  ENUM[(ENUM.HIT = 3)] = '命中';
  ENUM[(ENUM.MISS = 4)] = '未中';
  ENUM[(ENUM.VERIFYING = 5)] = '待审核';
  ENUM[(ENUM.INVALID = 6)] = '审核失败';
  return ENUM;
})({});

export const RANKING_TYPE = ((ENUM) => {
  ENUM[(ENUM.GLZ = '0')] = '高连中';
  ENUM[(ENUM.GMZ = '1')] = '高命中';
  ENUM[(ENUM.WATCH = '2')] = '关注';
  return ENUM;
})({});

export const SCHEME_TYPE = ((ENUM) => {
  ENUM[(ENUM.HOT = '0')] = '今日热卖';
  ENUM[(ENUM.MATCH_TIME = '1')] = '开赛时间';
  ENUM[(ENUM.WATCH = '2')] = '关注';
  return ENUM;
})({});

export const STOP_MATCH_STATUS = ((ENUM) => {
  ENUM[(ENUM.TC = 9)] = '推迟';
  ENUM[(ENUM.ZD = 10)] = '中断';
  ENUM[(ENUM.YZ = 11)] = '腰斩';
  ENUM[(ENUM.QX = 12)] = '取消';
  ENUM[(ENUM.DD = 13)] = '待定';
  return ENUM;
})({});

// 1 未开赛 2 上半场 3 中场 4 下半场 5 加时赛 7 点球大战 8 完场 9 推迟 10 中断 11 腰斩 12 取消 13 待定
export const MATCH_STATUS = ((ENUM) => {
  ENUM[(ENUM.WKS = 1)] = '未开赛';
  ENUM[(ENUM.SBC = 2)] = '上半场';
  ENUM[(ENUM.XBC = 3)] = '中场';
  ENUM[(ENUM.ZC = 4)] = '下半场';
  ENUM[(ENUM.JSS = 5)] = '加时赛';
  ENUM[(ENUM.DQDZ = 7)] = '点球大战';
  ENUM[(ENUM.WC = 8)] = '完场';
  ENUM[(ENUM.TC = 9)] = '推迟';
  ENUM[(ENUM.ZD = 10)] = '中断';
  ENUM[(ENUM.YZ = 11)] = '腰斩';
  ENUM[(ENUM.QX = 12)] = '取消';
  ENUM[(ENUM.DD = 13)] = '待定';
  return ENUM;
})({});

export const COUPON_TYPE = ((ENUM) => {
  ENUM[(ENUM.UNUSED = '0')] = '未使用';
  ENUM[(ENUM.USED = '1')] = '已使用';
  ENUM[(ENUM.EXPIRED = '2')] = '已过期';
  return ENUM;
})({});

export const ORDER_TYPE = ((ENUM) => {
  ENUM[(ENUM.UNUSED = 1)] = '充';
  ENUM[(ENUM.USED = 2)] = '购';
  ENUM[(ENUM.EXPIRED = 3)] = '退';
  return ENUM;
})({});

export const COUPON_STATUS = ((ENUM) => {
  ENUM[(ENUM.UNUSED = '1')] = '正常';
  ENUM[(ENUM.USED = '2')] = '作废';
  return ENUM;
})({});

export const COMPETITION_STATUS = ((ENUM) => {
  ENUM[(ENUM.MAIN = 'main')] = 'main';
  ENUM[(ENUM.ALL = 'all')] = 'all';
  return ENUM;
})({});
