import type { MenuDataItem, Settings as ProSettings } from '@ant-design/pro-layout';
import { GlobalModelState } from './global';
import { UserModelState } from './user';
import { DeviceState } from './divice';
import type { StateType } from './login';
import { Result } from '@/utils/tools';
import { NewMatchList } from '@/services/matchPage';
import { ABTestModelState } from '@/models/abtest';

export { GlobalModelState, UserModelState, DeviceState };

export type Loading = {
  global: boolean;
  effects: Record<string, boolean | undefined>;
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
    login?: boolean;
    divice?: boolean;
    mainMatchListResult?: Result<NewMatchList>,
  };
};

export type ConnectState = {
  global: GlobalModelState;
  loading: Loading;
  settings: ProSettings;
  user: UserModelState;
  login: StateType;
  divice: DeviceState;
  abtest: ABTestModelState;
  mainMatchListResult: Result<NewMatchList>,
  tips: any
};

export type Route = {
  routes?: Route[];
} & MenuDataItem;
