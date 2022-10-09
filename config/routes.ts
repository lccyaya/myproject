const router =
  // process.env.DEPLOY_TARGET === 'cn'
  //   ?
  [
    {
      path: '/mobile/scheme-detail',
      name: 'MobileSchemeDetail',
      component: '../pages/Details/scheme/webview/mobile',
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/:locale/external/newsdetail/:id',
          component: '../pages/NewsDetail',
        },
        {
          path: '/',
          component: '../layouts/NewBasicLayout',
          routes: [
            {
              path: '/',
              component: './Home/rediect',
            },
            {
              path: '/download',
              component: './DownloadNew/redirect',
            },
            {
              path: '/home',
              component: './Home/rediect',
            },
            {
              path: '/:locale/home',
              name: 'Home',
              cate: 'home',
              locale: 'key_home_tab',
              component: './Home',
            },
            {
              path: '/:locale/news',
              name: 'News',
              cate: 'news',
              locale: 'key_news',
              component: './News',
            },
            {
              path: '/:locale/highlight',
              name: 'Highlight',
              cate: 'highlight',
              locale: 'key_highlight',
              component: './Highlight',
            },
            {
              path: '/:locale/live',
              name: 'Live',
              cate: 'live',
              locale: 'key_live',
              component: './Live',
            },
            {
              path: '/:locale/match',
              name: 'Match',
              cate: 'match',
              locale: 'key_match',
              component: './views/match',
            },
            // {
            //   path: '/:locale/views/match',
            //   name: '比赛 (new)',
            //   cate: 'viewsmatch',
            //   locale: 'key_views_match',
            //   component: './views/Match',
            // },
            {
              path: '/:locale/expert',
              name: 'Expert',
              cate: 'expert',
              locale: 'key_expert',
              component: './Expert',
            },
            {
              path: '/:locale/info',
              name: 'Info',
              cate: 'info',
              locale: 'key_info_tab',
              component: './Info',
            },
            {
              path: '/:locale/download',
              name: 'Download',
              cate: 'download',
              locale: 'key_download',
              component: './DownloadNew',
            },
            {
              path: '/:locale/profile/center',
              name: 'ProfileCenter',
              cate: 'profile_center',
              locale: 'key_profile_center',
              component: '@/layouts/ProfileLayout/index',
              routes: [
                {
                  path: '/:locale/profile/center',
                  component: '@/pages/ProfileCenter/list',
                },
                {
                  path: '/:locale/profile/center/create',
                  component: '@/pages/ProfileCenter/create',
                },
                {
                  path: '/:locale/profile/center/create/step2',
                  component: '@/pages/ProfileCenter/Step2',
                },
                {
                  path: '/:locale/profile/center/create/detail',
                  component: '@/pages/ProfileCenter/detail',
                },
              ],
            },
            {
              path: '/:locale/mine',
              name: 'Mine',
              cate: 'mine',
              locale: 'key_me',
              component: './Mine',
            },
            {
              path: '/:locale/personal/setting',
              name: 'PersonalSetting',
              component: './Mine/PersonalSetting',
            },
            {
              path: '/:locale/security/setting',
              name: 'SecuritySetting',
              component: './Mine/SecuritySetting',
            },
            {
              path: '/:locale/terms',
              component: './Terms',
            },
            {
              path: '/:locale/privacy',
              component: './Privacy',
            },
            {
              path: '/:locale/myorders',
              component: './Myorder',
            },
            {
              path: '/:locale/settings',
              component: './Setting',
            },
            {
              path: '/:locale/account/:type',
              component: './Account',
            },
            {
              path: '/:locale/details/:matchId',
              component: '../pages/Details',
              cate: 'match_detail',
            },
            {
              path: '/:locale/teamdetails/:teamId',
              component: '../pages/TeamDetails',
              cate: 'team_detail',
            },
            {
              path: '/:locale/newsdetail/:id',
              component: '../pages/NewsDetail',
              cate: 'news_detail',
            },
            {
              path: '/:locale/expert-detail',
              component: '../pages/ExpertDetail',
              cate: 'expert_detail',
            },
            {
              path: '/:locale/scheme',
              component: '../pages/scheme/index.jsx',
              cate: 'scheme_detail',
            },
            {
              path: '/:locale/skilled-competition',
              component: './SkilledCompetition',
            },
            {
              path: '/:locale/expert/rank',
              component: './ExpertRank',
              cate: 'expert_ranking',
            },
            {
              path: '/:locale/expert/recommend',
              component: './Recommend',
              cate: 'scheme_match',
            },
            {
              path: '/:locale/expert/application',
              component: './ExpertApplication',
            },
            {
              component: './404',
            },
          ],
        },
      ],
    },
    {
      component: './404',
    },
  ];
// : [
//     {
//       path: '/mobile/scheme-detail',
//       name: 'MobileSchemeDetail',
//       component: '../pages/Details/scheme/webview/mobile',
//     },
//     {
//       path: '/',
//       component: '../layouts/SecurityLayout',
//       routes: [
//         {
//           path: '/:locale/external/newsdetail/:id',
//           component: '../pages/NewsDetail',
//         },
//         {
//           path: '/',
//           component: '../layouts/BasicLayout',
//           routes: [
//             {
//               path: '/',
//               component: './Home/rediect',
//             },
//             {
//               path: '/download',
//               component: './DownloadNew/redirect',
//             },
//             {
//               path: '/home',
//               component: './Home/rediect',
//             },
//             {
//               path: '/:locale/home',
//               name: 'Home',
//               locale: 'key_home_tab',
//               component: './Home',
//               cate: 'home',
//             },
//             {
//               path: '/:locale/news',
//               name: 'News',
//               locale: 'key_news',
//               component: './News',
//               cate: 'news',
//             },
//             {
//               path: '/:locale/highlight',
//               name: 'Highlight',
//               locale: 'key_highlight',
//               component: './Highlight',
//               cate: 'highlight',
//             },
//             {
//               path: '/:locale/live',
//               name: 'Live',
//               locale: 'key_live',
//               component: './Live',
//               cate: 'live',
//             },
//             {
//               path: '/:locale/match',
//               name: 'Match',
//               locale: 'key_match',
//               component: './views/match',
//               cate: 'match',
//             },
//             // {
//             //   path: '/:locale/views/match',
//             //   name: 'Match(new)',
//             //   cate: 'viewsmatch',
//             //   locale: 'key_views_match',
//             //   component: './views/Match',
//             // },
//             {
//               path: '/:locale/tips',
//               name: 'Tips',
//               locale: 'key_tips',
//               component: './Tips',
//               cate: 'tips',
//             },
//             {
//               path: '/:locale/info',
//               name: 'Info',
//               locale: 'key_info_tab',
//               component: './Info',
//               cate: 'info',
//             },
//             {
//               path: '/:locale/download',
//               name: 'Download',
//               locale: 'key_download',
//               component: './DownloadNew',
//               cate: 'download',
//             },
//             {
//               path: '/:locale/terms',
//               component: './Terms',
//             },
//             {
//               path: '/:locale/account/:type',
//               component: './Account',
//             },
//             {
//               path: '/:locale/details/:matchId',
//               component: '../pages/Details',
//               cate: 'match_detail',
//             },
//             {
//               path: '/:locale/teamdetails/:teamId',
//               component: '../pages/TeamDetails',
//               cate: 'news_detail',
//             },
//             {
//               path: '/:locale/newsdetail/:id',
//               component: '../pages/NewsDetail',
//               cate: 'news_detail',
//             },
//             {
//               component: './404',
//             },
//           ],
//         },
//       ],
//     },
//     {
//       component: './404',
//     },
//   ];
export default router;
