export const FOOTBALL_MASTER_TOKEN = '_FOOTBALL_MASTER_TOKEN_';
export const FOOTBALL_MASTER_LINE_CODE = '_FOOTBALL_MASTER_LINE_CODE_';

export const FOOTBALL_DISMISS_LIVE_RISK = '_FOOTBALL_DISMISS_LIVE_RISK_';

export const NOTIFICATION_DIALOG_LAST_APPEARED_AT =
  '_FOOTBALL_MASTER_NOTIFICATION_DIALOG_LAST_APPEAR_AT_';

export const STORAGE_INDEX_VALUE = 'STORAGE_INDEX_VALUE';

export const SESS_STORAGE_SELECTED_LEAGUES = 'SESS_STORAGE_SELECTED_LEAGUES';
export const SESS_STORAGE_LEAGUES_KEY = 'SESS_STORAGE_LEAGUES_KEY';

export const SESS_STORAGE_REFRESH_FCM_TOKEN = 'SESS_STORAGE_REFRESH_FCM_TOKEN';

export const APP_STORE_LINK = 'https://apps.apple.com/app/007-sport/id1570007107';

// 已经被下架，所以换成本地的下载地址
export const GOOGLE_PLAY_LINK = 'https://play.google.com/store/apps/details?id=com.sport007.app.android';
// export const GOOGLE_PLAY_LINK = 'https://image.football-master.net/007_1.1.5.apk';

export const HIGHLIGHT_FILTER_LEAGUES = 'HIGHLIGHT_FILTER_LEAGUES';
export const HIGHLIGHT_FILTER_TEAMS = 'HIGHLIGHT_FILTER_TEAMS';

export const ABTEST_USER_VERSION_PREFIX = 'ABTEST_USER_VERSION_';

export const ABTEST_UN_LOGGED_NAME = 'ABTEST_UN_LOGGED_VERSION';

export enum STATS_CODE {
  // 技术统计状态码
  ShotsOnTarget = 21, // 射正次数
  ShotsOffTarget = 22, // 射偏次数
  Possession = 25, // 控球率
  Attack = 23, // 进攻
  DangerousAttack = 24, // 危险进攻
  Corner = 2, // 角球
  RedCard = 4, // 红牌
  YellowCard = 3, // 黄牌
  Substitution = 9, // 换人
  Goal = 1, // 进球
  PenaltyKick = 8, // 点球
  OwnGoal = 17, // 乌龙球
}

export enum POP_POSITION_PC {
  home = 'pophome2',
  detail = 'popdetail2',
  tips = 'poptips2',
  info = 'popinfo2',
  me = 'popme2',
}

export enum POP_POSITION_MOBILE {
  home = 'pophome1',
  detail = 'popdetail1',
  tips = 'poptips1',
  info = 'popinfo1',
  me = 'popme1',
}

export enum BANNER_POSITION_PC {
  home = 'home2',
  detail = 'match2',
  tips = 'tips2',
}

export enum BANNER_POSITION_MOBILE {
  home = 'headline',
  detail = 'match1',
  tips = 'tips1',
}

export enum REPORT_ACTION {
  me_recharge = "coins",
  me_myorder = 'order',
  me_collect = 'collect',
  me_coupon = "coupon",
  me_setting ='setting',
  pop_display = 'pop_display',
  pop_click = 'pop_click',
  pop_close = 'pop_close',
  banner_display = 'banner_display',
  banner_click = 'banner_click',
  select_score = 'select_score',
  select_index = 'select_index',
  select_league = 'select_league',
  select_finish = 'select_finish',
  login_display = 'login_display',
  login_close = 'back',
  login_click = 'login',
  login_forget_password = 'forget',
  login_signup = 'signup',
  login_third_line = 'line',
  login_third_google = 'google',
  login_third_facebook = 'facebook',
  unsubscribe = 'unsubscribe',
  attention = 'attention',
  attention_more = 'attention_more',
  choose = 'choose',
  dt_vote_h = 'dt_vote_h',
  dt_vote_d = 'dt_vote_d',
  dt_vote_a = 'dt_vote_a',
  signup_close = 'back',
  signup_click = 'signup',
  signup_terms = 'terms',
  signup_login = 'login',
  forget_password_close = 'back',
  forget_password_next = 'next',
  forget_password_verify = 'verify',
  forget_password_continue = 'continue',
  forget_password_login = 'login',
  major_match_remind = 'mm_remind',
  major_match_vote_h = 'mm_vote_h',
  major_match_vote_a = 'mm_vote_a',
  major_match_vote_d = 'mm_vote_d',
  home_more_tips = 'moretips',
  home_tab = 'tab_',
  nav_home = 'home',
  nav_matchdetails = 'matchdetail',
  nav_teamdetails = 'teamdetails',
  nav_tips = 'tips',
  nav_match = 'match',
  nav_info = 'info',
  nav_me = 'me',
  nav_live = 'live',
  nav_news = 'news',
  nav_download = 'download',
  match_remind = 'match_remind',
  match_enter = 'match_enter',

  match_detail_remind = 'remind',
  match_detail_tab_index = 'tab_index',
  match_detail_tab_live = 'tab_live',
  match_detail_tab_lineup = 'tab_lineup',
  match_detail_tab_data = 'tab_data',
  match_detail_tab_info = 'tab_info',
  match_detail_tab2_1x2 = 'tab2_1X2',
  match_detail_tab2_handicap = 'tab2_handicap',
  match_detail_tab2_ou = 'tab2_ou',
  match_detail_company_click = 'company_click',
  match_detail_watch_live = 'watchlive',
  match_detail_choose_live = 'chooselive',
  match_detail_cancel_live = 'cancellive',
  match_detail_close_live = 'closelive',
  match_detail_fullscreen_live = 'fullscrlive',
  match_detail_tab3_rank = 'tab3_rank',
  match_detail_tab3_home = 'tab3_home',
  match_detail_tab3_away = 'tab3_away',
  match_detail_tab3_recent = 'tab3_recent',
  match_detail_team_enter = 'team_enter',
  match_detail_tab4_h2h = 'tab4_h2h',
  match_detail_tab4_home = 'tab4_home',
  match_detail_tab4_away = 'tab4_away',
  match_detail_match_enter = 'match_enter',
  match_detail_live_display = 'video_display',
  match_detail_highlight_display = 'highlight_display',
  match_detail_playback_display = 'playback_display',
  match_detail_live_play = 'play_live',
  match_detail_highlight_play = 'play_highlight',
  match_detail_playback_play = 'play_playback',
  match_detail_highlight_played = 'watch_highlight',
  match_detail_tab_highlight = 'tab_highlight',
  match_detail_tab_playback = 'tab_playback',
  match_detail_tab_overview = 'tab_overview',
  match_detail_news_detail = 'news_detail',
  tips_match_enter = 'match_enter',
  info_tab = 'tab_',
  info_tab2 = 'tab2_',
  info_tab3 = 'tab3_',
  info_team_enter = 'team_enter',
  info_match_enter = 'match_enter',
  me_info_enter = 'info_enter', // ok
  me_my_team_enter = 'myteam_enter', // ok
  me_change_lang = 'changelanguage', // ok
  me_select_lang = 'select_', // ok
  me_change_password = 'changepswd', // ok
  me_login = 'login', // ok
  me_logout = 'logout', // ok
  me_facebook_open = 'facebook_open', // ok
  me_facebook_close = 'facebook_close', // ok
  me_google_open = 'google_open', // ok
  me_google_close = 'google_close', // ok
  me_line_open = 'line_open', // ok
  me_line_close = 'line_close', // ok
  me_name_save = 'name_save', // ok
  me_password_cancel = 'pswd_cancel',
  me_password_verify = 'pswd_verify', // ok
  me_password_continue = 'continue', // ok
  download_global_open = 'open',
  download_first_screen_download = 'download1',
  download_last_screen_download = 'download2',
  news_hot_detail = 'hot_detail',
  news_detail = 'news_detail',
  news_detail_more_detail = 'more_detail',
  news_detail_like = 'like',
  news_detail_unlike = 'unlike',
  news_detail_comment_order_earliest = 'earliest',
  news_detail_comment_order_latest = 'latest',
  news_detail_send_comment = 'send_comment',
  news_detail_reply_comment = 'click_comment',
  news_detail_like_comment = 'like_comment',
  news_detail_unlink_comment = 'unlink_comment',
  news_detail_add_comment = 'add_comment',
  download_app = 'download',
  version_a_home_recommend_banner_display = 'info_banner_display',
  version_a_home_recommend_banner_click = 'info_banner_click',
  version_a_major_match_click = 'mm_enter',
  remind_download_click = 'remind_download',
  // version_a_highlight_display = 'highlight_display',
  version_a_highlight_click = 'highlight_click',
  version_a_hot_news_click = 'hot_detail',
  version_b_major_match_banner_enter = 'mm_banner_enter',
  highlight_filter_by_time = 'time',
  highlight_filter_by_plays = 'plays',
  highlight_filter_select = 'select',
}

export enum REPORT_CATE {
  home = 'home',
  tips = 'tips',
  details = 'matchdetail',
  info = 'info',
  me = 'me',
  match = 'match',
  select_league = 'select_league',
  login = 'login',
  my_team = 'my_team',
  match_detail = 'matchdetail',
  live = 'live',
  signup = 'signup',
  forget_password = 'forgetpassword',
  download = 'download',
  news = 'news',
  news_detail = 'news_detail',
  highlight = 'video',
  teamdetails = 'teamdetails',
  expert = 'expert',
  mine = 'mine',
  recommend = 'recommend',
  expert_detail = "expert_detail",
  expert_ranking = "expert_ranking",
  scheme_match = "scheme_match",
  scheme_detail = "scheme_detail"
}

// 获取sessionStorage的数据
export const getSessionStorage = (key: string, initVal: any) => {
  try {
    return JSON.parse(sessionStorage.getItem(key) || initVal);  
  } catch (error) {
    return initVal;
  }
}

// 获取localStorage的数据
export const getLocalStorage = (key: string, initVal: any, type:any) => {
  try {
    const val = localStorage.getItem(key);
    if (type === 'Boolean') {
      if (val === 'false') { return false; }
      if (val === 'true') { return true; }
      return initVal;
    }
    return JSON.parse(val || initVal);  
  } catch (error) {
    return initVal;
  }
}

// 获取localStorage的数据
export const getLocalStorageByBoolean = (key: string) => {
  try {
    const val = localStorage.getItem(key);
    if (val == 'false') { return false; }
    if (val == 'true') { return true; }
    return true;
  } catch (error) {
    return true;
  }
}