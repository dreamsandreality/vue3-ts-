import { Router, createRouter, createWebHistory } from 'vue-router'
const routerHistory = createWebHistory()
const router: Router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/front/login',
      component: ()=>import('../views/front_views/Login.vue')
    },
    {
      path: '/',
      component: ()=>import('../front_layout/Layout.vue'),
      children:[
        {
          path: '/',
          component: ()=>import('../views/front_views/Home.vue'),
          meta:{
            count: 1
          }
        },
        {
          path: '/recommend',
          component: ()=>import('../views/front_views/Recommend.vue'),
          meta:{
            count: 2
          }
        },
        {
          path: '/hot',
          component: ()=>import('../views/front_views/Hot.vue'),
          name: 'hot',
          meta:{
            count: 3
          },
          children: [
            {
              path: '/hot-essay',
              component: ()=>import('../components/Hot-view-components/Essay.vue'),
              meta: {
                title: '精选文章榜'
              }
            },
            {
              path: '/hot-column',
              component: ()=>import('../components/Hot-view-components/Column.vue'),
              meta: {
                title: '精选专栏榜'
              }
            },
            {
              path: '/hot-problem',
              component: ()=>import('../components/Hot-view-components/Problem.vue'),
              meta: {
                title: '精选问题榜'
              }
            },
            {
              path: '/hot-writer',
              component: ()=>import('../components/Hot-view-components/Writer.vue'),
              meta: {
                title: '优质作者榜'
              }
            }
          ]
        },
        {
          path: '/concern',
          component: ()=>import('../views/front_views/Concern.vue'),
          redirect: '/concern-column',
          meta:{
            count: 4
          },
          children: [
            {
              path: '/concern-column',
              component: ()=>import('../components/ConcernComponent/myColumn.vue'),
              meta: {
                count: 4,
                reload: 1
              }
            },
            {
              path: '/concern-problem',
              component: ()=>import('../components/ConcernComponent/myProblems.vue'),
              meta: {
                count: 4,
                reload: 2
              }
            },
            {
              path: '/concern-writer',
              component: ()=>import('../components/ConcernComponent/myWriter.vue'),
              meta: {
                count: 4,
                reload: 3
              }
            }
          ]
        },
        {
          path: '/problem-s',
          component: ()=>import('../views/front_views/Problem.vue'),
          meta: {
            count: 5
          }
        },
        {
          path: '/mine',
          component: ()=>import('../views/front_views/Mine.vue'),
          redirect: '/mine/myEssay',
          children: [
            {
              path: '/mine/myEssay',
              component: ()=>import('../components/Essay-Content.vue'),
              meta: {
                count: 12
              }
            },
            {
              path: '/my-get',
              component: ()=>import('../components/Myget.vue'),
              redirect: '/like-myGet',
              children: [
                {
                  path: '/like-myGet',
                  component: ()=>import('../components/myGet-like.vue'),
                  meta: {
                    count: 222
                  }
                },
                {
                  path: '/like-mySend',
                  component: ()=>import('../components/myGet-sendLike.vue'),
                  meta: {
                    count: 521
                  }
                },
                {
                  path: '/reply-me',
                  component: ()=>import('../components/myGet-reply.vue'),
                  meta: {
                    count: 522
                  }
                },
                {
                  path: '/answer-me',
                  component: ()=>import('../components/myGet-answer.vue'),
                  meta: {
                    count: 533
                  }
                }
              ],
              meta: {
                count: 222
              }
            },
            {
              path: '/mine/myColumn',
              component: ()=>import('../components/Column-Content.vue'),
              meta: {
                count: 13
              }
            },
            {
              path: '/mine/like',
              component: ()=>import('../components/Like-Content.vue'),
              meta: {
                count: 14
              }
            },
            {
              path: '/mine/concern',
              component: ()=>import('../components/Concern-Content.vue'),
              redirect: '/myconcern',
              children: [
                {
                  path: '/myconcern',
                  component: ()=>import('../components/My-Concern.vue'),
                  meta: {
                    count: 24
                  }
                },
                {
                  path: '/concernme',
                  component: ()=>import('../components/Concernme.vue'),
                  meta: {
                    count: 21
                  }
                },
                {
                  path: '/concernlmun',
                  component: ()=>import('../components/Concernlumn.vue'),
                  meta: {
                    count: 22
                  }
                },
                {
                  path: '/concernPro',
                  component: ()=>import('../components/concernProblem.vue'),
                  meta: {
                    count: 23
                  }
                }
              ]
            }
          ]
        },
        {
          path: '/history-s',
          component: ()=>import('../views/front_views/History.vue'),
          meta: {
            count: 123
          }
        },
        {
          path: '/edit-myself',
          component: ()=>import('../views/front_views/editMyself.vue'),
          redirect: '/about-s',
          meta: {
            count: 1001
          },
          children: [
            {
              path: '/about-s',
              component: ()=>import('../components/myselfViews/aboutMyself.vue'),
              meta: {
                count: 1001
              }
            },
            {
              path: '/account-s',
              component: ()=>import('../components/myselfViews/accountSet.vue'),
              meta: {
                count: 2001
              }
            }
          ]
        },
        {
          path: '/draft',
          component: ()=>import('../views/front_views/Draft.vue'),
          redirect: '/draft-essay',
          meta: {
            count: 2023
          },
          children: [
            {
              path: '/draft-essay',
              component: ()=>import('../components/Draft/essay.vue'),
              meta: {
                count: '2023'
              }
            },
            {
              path: '/draft-column',
              component: ()=>import('../components/Draft/column.vue'),
              meta: {
                count: '2024'
              }
            },
            {
              path: '/draft-problem',
              component: ()=>import('../components/Draft/problem.vue'),
              meta: {
                count: '2025'
              }
            },
            {
              path: '/draft-total',
              component: ()=>import('../components/Draft/draft-s.vue'),
              meta: {
                count: '2026'
              }
            }
          ]
        },
        {
          path: '/search-S',
          component: ()=>import('../components/searchContent/Search.vue'),
          name: 'search-S',
          meta: {
            count: 147
          }
        },
        {
          path: '/aboutEssay-index/:id/:userid',
          name: 'aboutEssay-index',
          component: ()=>import('../views/front_views/Essay-watch.vue'),
          meta: {
            count: 2864
          }
        },
        {
          path: '/others',
          component: ()=>import('../views/front_views/OtherUser.vue'),
          redirect: '/other/essay',
          meta: {
            count: 2865
          },
          children: [
            {
              path: '/other/essay',
              component: ()=>import('../components/otherPages/otherEssay.vue')
            },
            {
              path: '/other/column',
              component: ()=>import('../components/otherPages/otherColumns.vue')
            },
            {
              path: '/other/collection',
              component: ()=>import('../components/otherPages/otherCollections.vue')
            },
            {
              path: '/other/concern',
              component: ()=>import('../components/otherPages/otherConcern.vue')
            }
          ]
        },
        {
          path: '/socket',
          component: ()=>import('../views/front_views/Socet.vue')
        }
      ]
    },
    {
      path: '/writeEssay/:id',
      name: 'writeEssay',
      component: ()=>import('../views/front_views/Write-Essay.vue')
    }
  ]
})
export default router