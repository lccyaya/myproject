import type { Effect, Reducer } from 'umi';

import { queryCurrent } from '@/services/user';
import type { UserInfoType } from '@/services/user';
import { logout } from '@/utils/request';
import { history } from 'umi'
import { toShortLangCode } from '@/utils/utils';
import { locale } from '@/app';

export type UserModelState = {
  currentUser?: UserInfoType | null;
  // 是否已发起过获取用户的请求
  requested: boolean;
  // 是否已经获取到结果，无论是否登录
  gotResult: boolean;
};

export type UserModelType = {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetchCurrent: Effect;
    logout: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    setRequested: Reducer<UserModelState>;
    setGotResult: Reducer<UserModelState>;
  };
};

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: null,
    requested: false,
    gotResult: false,
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      yield put({
        type: 'setRequested',
        payload: true,
      });
      const response = yield call(queryCurrent);
      const { pathname } = history.location
      if (pathname.includes('account') && !response.success) {
        const lang = toShortLangCode(locale.getLocale());
        history.push(`/${lang}/home`)
      }
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
      yield put({
        type: 'setGotResult',
        payload: true,
      });
    },
    *logout(_, { call, put }) {
      yield call(logout);
      yield put({
        type: 'saveCurrentUser',
        payload: {
          data: null,
        },
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state!,
        currentUser: action.payload.data || null,
      };
    },
    setRequested(state, action) {
      return {
        ...state!,
        requested: action.payload,
      };
    },
    setGotResult(state, action) {
      return {
        ...state!,
        gotResult: action.payload,
      };
    },
  },
};

export default UserModel;
