/* eslint-disable no-underscore-dangle */
import request, { extendOptionsAuth } from '@/utils/request';
import { normalizeResponse } from '@/utils/tools';
import { FOOTBALL_MASTER_TOKEN } from '@/constants';
import { sleep } from '@/utils/tools';
import { timeStorageSet } from '@/utils/timestorage';
import { refreshMessageToken } from '@/services/notification';

export type LoginParamsType = {
  account: string;
  password: string;
  channel: string;
  code?: string;
};

export type RegisterParamsType = {
  account: string;
  password: string;
  nickname: string;
  code?: string;
};

export type GetCaptchaParamsType = {
  account: string;
  channel: string;
  scene?: string
};
export type CheckCodeParamsType = {
  account: string;
  channel: string;
  scene: string;
  code: string;
}

export type LoginResultType = {
  token: string;
  refresh_token: string;
  bound: boolean;
  email: string;
};

export async function getCaptchaCode(params: GetCaptchaParamsType) {
  const result = await request('/api/v1/send-code', {
    method: 'POST',
    data: params,
  });
  return normalizeResponse<{}>(result);
}

export async function register(params: RegisterParamsType) {
  const result = await request('/api/v1/register', {
    method: 'POST',
    data: params,
  });
  const _info = normalizeResponse<boolean>(result);
  if (_info.success) {
    // 保存登录 token
    const { token } = result.data;
    timeStorageSet(FOOTBALL_MASTER_TOKEN, token, 864e5 - 10 * 1000);
    extendOptionsAuth();
    refreshMessageToken();
    await sleep(20);
  }
  return _info;
}

// 检查邮箱是否已注册
export async function checkAccountIsRegistered(params: GetCaptchaParamsType) {
  const result = await request('/api/v1/account/is-registered', {
    method: 'POST',
    data: params,
  });
  return normalizeResponse<boolean>(result);
}

// 检查注册参数
export async function checkAccountParams(params: GetCaptchaParamsType) {
  const result = await request('/api/v1/register/check', {
    method: 'POST',
    data: params,
  });
  return normalizeResponse<boolean>(result);
}

export async function login(params: LoginParamsType) {
  const result = await request('/api/v1/login', {
    method: 'POST',
    data: params,
  });

  const _info = normalizeResponse<LoginResultType>(result);
  if (_info.success) {
    // 保存登录 token
    const { token } = result.data;
    timeStorageSet(FOOTBALL_MASTER_TOKEN, token, 864e5 - 10 * 1000);
    extendOptionsAuth();
    refreshMessageToken();
    await sleep(20);
  }
  return _info;
}

export type CheckCodeForResetPasswordParamsType = Pick<RegisterParamsType, 'code' | 'email'>;
export async function checkCodeForResetPassword(params: CheckCodeForResetPasswordParamsType) {
  const result = await request('/api/check-code', {
    method: 'POST',
    data: params,
  });
  return normalizeResponse<{ ticket: string }>(result);
}

export type ResetPasswordType = {
  email: string;
  ticket: string;
  password: string;
};

export async function resetPassword(params: ResetPasswordType) {
  const result = await request('/api/v1/pwd-reset', {
    method: 'POST',
    data: params,
  });
  return normalizeResponse<string>(result);
}

export type GoogleLoginType = {
  client: 'web';
  id_token: string;
};

export type GoogleLoginResult = {
  token?: string;
  refresh_token: string;
  bound: boolean;
  email: string;
};

export async function googleLogin(params: GoogleLoginType) {
  const result = await request('/api/login/google', {
    method: 'POST',
    data: params,
  });
  const _info = normalizeResponse<GoogleLoginResult>(result);
  if (_info.success && _info.data.bound) {
    // 保存登录 token
    const { token } = result.data;
    timeStorageSet(FOOTBALL_MASTER_TOKEN, token, 864e5 - 10 * 1000);
    extendOptionsAuth();
    refreshMessageToken();
    await sleep(20);
  }
  return _info;
}

export type BindEmailType = {
  id_token: string;
  client: 'web';
  email: string;
  code: string;
};
export type BindEmailResult = {
  bound: boolean;
  token: string;
  refresh_token: string;
};

export async function bindEmail(params: BindEmailType) {
  const result = await request('/api/bindmail/google', {
    method: 'POST',
    data: params,
  });
  const _info = normalizeResponse<BindEmailResult>(result);
  if (_info.success && _info.data.bound) {
    // 保存登录 token
    const { token } = result.data;
    timeStorageSet(FOOTBALL_MASTER_TOKEN, token, 864e5 - 10 * 1000);
    extendOptionsAuth();
    refreshMessageToken();
    await sleep(20);
  }
  return _info;
}

export type ModifyNicknameType = {
  key: 'nickname' | 'avatar';
  value: string;
};
export async function modifyNickname(params: ModifyNicknameType) {
  const result = await request('/api/modify-info', {
    method: 'POST',
    data: params,
  });
  return normalizeResponse<string>(result);
}

// google绑定/解绑
export async function bindGoogle(params: { id_token: string }) {
  const result = await request('/api/bind-google', {
    method: 'POST',
    data: params,
  });
  return normalizeResponse<string>(result);
}
export async function unbindThird(params: { channel: 'google' | 'line' | 'facebook' }) {
  const result = await request('/api/unbind-third', {
    method: 'POST',
    data: params,
  });
  return normalizeResponse<string>(result);
}

// 修改密码
export async function checkPwd(params: { password: string }) {
  const result = await request('/api/v1/user/check-pwd', {
    method: 'POST',
    data: params,
  });
  return normalizeResponse<string>(result);
}

export async function modifyPwd(params: { password: string; ticket: string }) {
  const result = await request('/api/v1/user/modify-pwd', {
    method: 'POST',
    data: params,
  });
  return normalizeResponse<string>(result);
}

export type LineLoginResult = {
  access_token: string;
  bound: boolean;
  token?: boolean;
};

// line 登录
export async function lineWebLogin(params: { code: string }) {
  const result = await request('/api/login/lineweb', {
    method: 'POST',
    data: params,
  });
  const _info = normalizeResponse<LineLoginResult>(result);
  if (_info.success && _info.data.bound) {
    // 保存登录 token
    const { token } = result.data;
    timeStorageSet(FOOTBALL_MASTER_TOKEN, token, 864e5 - 10 * 1000);
    extendOptionsAuth();
    refreshMessageToken();
    await sleep(20);
  }
  return _info;
}

type LineBindMailParam = {
  access_token: string;
  email: string;
  code: string;
};
// line 绑定邮箱
export async function lineBindMail(params: LineBindMailParam) {
  const result = await request('/api/bindmail/line', {
    method: 'POST',
    data: params,
  });
  const _info = normalizeResponse<BindEmailResult>(result);
  if (_info.success && _info.data.bound) {
    // 保存登录 token
    const { token } = result.data;
    timeStorageSet(FOOTBALL_MASTER_TOKEN, token, 864e5 - 10 * 1000);
    extendOptionsAuth();
    refreshMessageToken();
    await sleep(20);
  }
  return _info;
}

// line 绑定邮箱
export async function bindLine(params: { code: string }) {
  const result = await request('/api/bind-lineweb', {
    method: 'POST',
    data: params,
  });
  return normalizeResponse<boolean>(result);
}

export type LoginResult = {
  token?: string;
  refresh_token: string;
  bound: boolean;
  email: string;
};

// line 登录
export async function facebookWebLogin(params: { access_token: string }) {
  const result = await request('/api/login/facebook', {
    method: 'POST',
    data: params,
  });
  const _info = normalizeResponse<LoginResult>(result);
  if (_info.success && _info.data.bound) {
    // 保存登录 token
    const { token } = result.data;
    timeStorageSet(FOOTBALL_MASTER_TOKEN, token, 864e5 - 10 * 1000);
    extendOptionsAuth();
    refreshMessageToken();
    await sleep(20);
  }
  return _info;
}

type FacebookBindMailParam = {
  access_token: string;
  email: string;
  code: string;
};
// line 绑定邮箱
export async function facebookBindMail(params: FacebookBindMailParam) {
  const result = await request('/api/bindmail/facebook', {
    method: 'POST',
    data: params,
  });
  const _info = normalizeResponse<BindEmailResult>(result);
  if (_info.success && _info.data.bound) {
    // 保存登录 token
    const { token } = result.data;
    timeStorageSet(FOOTBALL_MASTER_TOKEN, token, 864e5 - 10 * 1000);
    extendOptionsAuth();
    refreshMessageToken();
    await sleep(20);
  }
  return _info;
}

// line 绑定邮箱
export async function bindFacebook(params: { access_token: string }) {
  const result = await request('/api/bind-facebook', {
    method: 'POST',
    data: params,
  });
  return normalizeResponse<boolean>(result);
}

// 校验验证码（邮箱、手机号验证码）
export async function checkCode(params: CheckCodeParamsType) {
  const result = await request('/api/v1/check-code', {
    method: 'POST',
    data: params,
  });
  return normalizeResponse<{
    ticket: string;
  }>(result);
}

// 个人中心绑定手机号、邮箱检测，通过自动发验证码
export async function bindAccountCheck(params: {account: string, channel: string}) {
  const result = await request('/api/v1/user/bind-account-check', {
    method: 'POST',
    data: params,
  });
  return normalizeResponse<{
    ticket: string;
  }>(result);
}

// 个人中心绑定手机号、邮箱
export async function bindAccount(params: {account: string, channel: string, ticket: string}) {
  const result = await request('/api/v1/user/bind-account', {
    method: 'POST',
    data: params,
  });
  return normalizeResponse<{}>(result);
}

// 未设置密码的用户初始化密码
export async function setUserPwd(params: {password: string, password_confirm: string}) {
  const result = await request('/api/v1/user/set-pwd', {
    method: 'POST',
    data: params,
  });
  return normalizeResponse<{}>(result);
}
