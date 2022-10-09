// import { isServer } from '@/utils/env';
// import { getLangFromPath } from '@/utils/utils';
// import moment from 'moment';
// // import { ssrGet, ssrSet } from '@/utils/ssr';

// // export const ssr = {
// //   beforeRenderServer: async ({
// //     // env,
// //     location,
// //     // history,
// //     // mode,
// //     context,
// //   }: any) => {
// //     const lang = context.lang || getLangFromPath(location.pathname);
// //     ssrSet({
// //       host: location.host || context.host || '',
// //       locale: lang,
// //       userAgent: context.userAgent ?? '',
// //       timezoneOffset: context.timezoneOffset ?? -new Date().getTimezoneOffset() / 60,
// //       timezone: context.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
// //       // isPhone: true
// //       isPhone: context.isPhone || false,
// //     });
// //     moment.locale(lang);
// //   },
// // };

// export const locale = {
//   getLocale: (pathname?: string) => {
//     return isServer ? ssrGet('locale') : getLangFromPath(pathname);
//   },
// };


import { getLangFromPath } from '@/utils/utils';

export const locale = {
  getLocale: (pathname?: string) => {
    return getLangFromPath(pathname);
  },
};

