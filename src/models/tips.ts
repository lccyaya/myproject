const TipsModel = {
  namespace: 'tips',
  state: {
    showTips: false,
  },

  effects: {
    *setShowTips({ payload }, { put }) {
      yield put({
        type: 'saveShowTips',
        payload,
      });
    },
  },

  reducers: {
    saveShowTips(state = { showTips: false }, { payload }) {
      return {
        ...state,
        showTips: payload,
      };
    },
  },
};

export default TipsModel;
