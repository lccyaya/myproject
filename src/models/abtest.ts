import type { Effect, Reducer } from 'umi';
import { getVersion } from '@/services/abtest';

export type ABTestModelState = {
  version: 'A' | 'B' | '';
};

export type ABTestModelType = {
  namespace: 'abtest';
  state: ABTestModelState;
  effects: {
    fetchVersion: Effect;
  };
  reducers: {
    setVersion: Reducer<ABTestModelState>;
  };
};

const ABTestModel: ABTestModelType = {
  namespace: 'abtest',
  state: {
    version: 'A',
  },
  effects: {
    * fetchVersion({ payload }, { call, put }) {
      const res = yield call(getVersion, payload.nickname);
      yield put({
        type: 'setVersion',
        payload: res.success ? res.data : 'A',
      });
    }
  },
  reducers: {
    setVersion(state, action) {
      return {
        ...state,
        version: action.payload,
      };
    }
  },
};

export default ABTestModel;
