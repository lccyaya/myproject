import type { Reducer, Effect } from 'umi';

export type DeviceState = {
    isPhone: boolean;
};

export type DiviceModelType = {
    namespace: 'divice';
    state: DeviceState;
    effects: {
        isPhone: Effect;
    };
    reducers: {
        setPhone: Reducer<DeviceState>;
    };
};

const DiviceModel: DiviceModelType = {
    namespace: 'divice',

    state: {
        isPhone: false,
    },

    effects: {
        *isPhone({payload }, { put }) {

            yield put({
                type: 'setPhone',
                payload,
            });
        }
    },

    reducers: {
        setPhone(state = { isPhone: false }, { payload }): DeviceState {
            return {
                ...state,
                isPhone: payload
            };
        },
    },
};

export default DiviceModel;
