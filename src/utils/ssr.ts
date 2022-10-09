export interface SsrMemoryVars {
  locale: string;
  userAgent: string;
  timezoneOffset: number;
  timezone: string;
  host: string;
  isPhone: boolean;
}

const variables: SsrMemoryVars = {
  locale: '',
  userAgent: '',
  timezoneOffset: 0,
  timezone: '',
  host: '',
  isPhone: false,
};

export const ssrSet = (vars: Partial<SsrMemoryVars>) => {
  Object.assign(variables, vars);
};

export const ssrGet = <T extends keyof SsrMemoryVars>(key: T) => {
  return variables[key];
};
