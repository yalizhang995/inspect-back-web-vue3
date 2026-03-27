import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes = [
    {
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [
            {
                path: '/redirect/:path(.*)',
                component: () => import('@/views/redirect')
            }
        ]
    },
    {
        path: '/login',
        component: () => import('@/views/login'),
        hidden: true
    },
    {
        path: '/register',
        component: () => import('@/views/register'),
        hidden: true
    },
    // 预警H5模板中转页
    {
        path: '/warn',
        component: () => import('@/views/warn/template'),
        hidden: true
    },
    {
        path: '/404',
        component: () => import('@/views/error/404'),
        hidden: true
    },
    {
        path: '/401',
        component: () => import('@/views/error/401'),
        hidden: true
    },
    {
        path: '',
        component: Layout,
        redirect: 'index',
        children: [
            {
                path: 'index',
                component: () => import('@/views/index'),
                name: 'Index',
                meta: { title: '首页', icon: 'dashboard', affix: true }
            }
        ]
    },
    {
        path: '/user',
        component: Layout,
        hidden: true,
        redirect: 'noredirect',
        children: [
            {
                path: 'profile',
                component: () => import('@/views/system/user/profile/index'),
                name: 'Profile',
                meta: { title: '个人中心', icon: 'user' }
            }
        ]
    },
      
]

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [
    {
        path: '/system/user-auth',
        component: Layout,
        hidden: true,
        permissions: ['system:user:edit'],
        children: [
            {
                path: 'role/:userId(\\d+)',
                component: () => import('@/views/system/user/authRole'),
                name: 'AuthRole',
                meta: { title: '分配角色', activeMenu: '/system/user' }
            }
        ]
    },
    {
        path: '/system/role-auth',
        component: Layout,
        hidden: true,
        permissions: ['system:role:edit'],
        children: [
            {
                path: 'user/:roleId(\\d+)',
                component: () => import('@/views/system/role/authUser'),
                name: 'AuthUser',
                meta: { title: '分配用户', activeMenu: '/system/role' }
            }
        ]
    },
    {
        path: '/system/dict-data',
        component: Layout,
        hidden: true,
        permissions: ['system:dict:list'],
        children: [
            {
                path: 'index/:dictId(\\d+)',
                component: () => import('@/views/system/dict/data'),
                name: 'Data',
                meta: { title: '字典数据', activeMenu: '/system/dict' }
            }
        ]
    },
    {
        path: '/monitor/job-log',
        component: Layout,
        hidden: true,
        permissions: ['monitor:job:list'],
        children: [
            {
                path: 'index/:jobId(\\d+)',
                component: () => import('@/views/monitor/job/log'),
                name: 'JobLog',
                meta: { title: '调度日志', activeMenu: '/monitor/job' }
            }
        ]
    },
    {
        path: '/tool/gen-edit',
        component: Layout,
        hidden: true,
        permissions: ['tool:gen:edit'],
        children: [
            {
                path: 'index/:tableId(\\d+)',
                component: () => import('@/views/tool/gen/editTable'),
                name: 'GenEdit',
                meta: { title: '修改生成配置', activeMenu: '/tool/gen' }
            }
        ]
    },
    // 前台系统管理
    {
        path: '/reception/user-auth',
        component: Layout,
        hidden: true,
        permissions: ['reception:user:edit'],
        children: [
            {
                path: 'role/:userId(\\d+)',
                component: () => import('@/views/reception/user/authRole'),
                name: 'AuthRole',
                meta: { title: '分配角色', activeMenu: '/reception/user' }
            }
        ]
    },
    {
        path: '/reception/role-auth',
        component: Layout,
        hidden: true,
        permissions: ['reception:role:edit'],
        children: [
            {
                path: 'user/:roleId(\\d+)',
                component: () => import('@/views/reception/role/authUser'),
                name: 'AuthUser',
                meta: { title: '分配用户', activeMenu: '/reception/role' }
            }
        ]
    },
    /**基础信息 */
    {
        path: '/basic',
        component: Layout,
        hidden: true,
        permissions: ['biz:inspSiteInfo:see'],
        children: [
            // {
            //     path: 'inspSiteInfo',
            //     component: () => import('@/views/biz/inspSiteInfo/index'),
            //     name: 'inspSiteInfo',
            //     meta: { title: '站点信息', activeMenu: '/tool/gen' }
            // },
            // {
            //     path: 'inspSiteDirector',
            //     component: () => import('@/views/biz/inspSiteDirector/index'),
            //     name: 'inspSiteDirector',
            //     meta: { title: '站点关联关系', activeMenu: '/basic/inspSiteInfo'}
            // },
            // 站点信息
            {
                path: 'infoTaskInfo',
                component: () => import('@/views/biz/inspSiteInfo/taskInfo'),
                name: 'infoTaskInfo',
                meta: { title: '站点信息-任务详情', activeMenu: '/basic/inspSiteInfo'}
            },
            {
                path: 'infoRecord',
                component: () => import('@/views/biz/inspSiteInfo/record'),
                name: 'infoRecord',
                meta: { title: '站点信息-记录详情', activeMenu: '/basic/inspSiteInfo'}
            },
            // 站点关系
            {
                path: 'taskInfo',
                component: () => import('@/views/biz/inspSiteTree/taskInfo'),
                name: 'taskInfo',
                meta: { title: '站点关系-任务详情', activeMenu: '/basic/inspSiteTree'}
            },
            {
                path: 'record',
                component: () => import('@/views/biz/inspSiteTree/record'),
                name: 'record',
                meta: { title: '站点关系-记录详情', activeMenu: '/basic/inspSiteTree'}
            },

        ]
    },
    /**
     * 基础信息
     * 新媒体
     *  */
    {
        path: '/media',
        component: Layout,
        hidden: true,
        permissions: ['biz:inspSiteInfo:see'],
        children: [
            // 站点信息
            {
                path: 'infoTaskInfo',
                component: () => import('@/views/biz/inspMediaInfo/taskInfo'),
                name: 'infoTaskInfo',
                meta: { title: '新媒体站点信息-任务详情', activeMenu: '/media/inspMediaInfo'}
            },
            {
                path: 'infoRecord',
                component: () => import('@/views/biz/inspMediaInfo/record'),
                name: 'infoRecord',
                meta: { title: '新媒体站点信息-记录详情', activeMenu: '/media/inspMediaInfo'}
            },
            // 站点关系
            {
                path: 'taskInfo',
                component: () => import('@/views/biz/inspSiteXmt/taskInfo'),
                name: 'taskInfo',
                meta: { title: '新媒体站点关系-任务详情', activeMenu: '/media/inspSiteXmt'}
            },
            {
                path: 'record',
                component: () => import('@/views/biz/inspSiteXmt/record'),
                name: 'record',
                meta: { title: '新媒体站点关系-记录详情', activeMenu: '/media/inspSiteXmt'}
            },

        ]
    },
    /**机器数据 */
    {
        path: '/machine',
        component: Layout,
        hidden: true,
        permissions: ['biz:inspSiteInfo:see'],
        children: [
            // 首页连通
            {
                path: 'HomeConnectivityInfo',
                component: () => import('@/views/biz/HomeConnectivity/info'),
                name: 'HomeConnectivityInfo',
                meta: { title: '首页联通详情', activeMenu: '/machine/HomeConnectivity'}
            },

        ]
    },
    /**订单管理-报告任务-人工录入 */
    {
        path: '/orderinfo',
        component: Layout,
        hidden: true,
        permissions: ['biz:inspReportTask:info'],
        children: [
            {
                path: 'inspHand',
                component: () => import('@/views/biz/inspReportTask/info'),
                name: 'inspHand',
                meta: { title: '人工录入', activeMenu: '/orderinfo/inspReportTask'}
            },
            {
                path: 'orderBatchInfo',
                component: () => import('@/views/biz/inspOrderBatch/info'),
                name: 'orderBatchInfo',
                meta: { title: '报告任务', activeMenu: '/orderinfo/inspOrderBatch' }
            },
            // 订单信息-
            {
                path: 'orderInfo',
                component: () => import('@/views/biz/inspOrderInfo/info'),
                name: 'orderInfo',
                meta: { title: '站点范围', activeMenu: '/orderinfo/inspOrderInfo' }
            },
            // 流转信息(详情)
            {
                path: 'orderFlowInfo',
                component: () => import('@/views/biz/inspOrderFlow/info'),
                name: 'orderFlowInfo',
                meta: { title: '流转信息', activeMenu: '/orderinfo/inspOrderFlow' }
            }
        ]
    },
    /**新媒体 */
    // 账号更新
    {
        path: '/mediaDate',
        component: Layout,
        hidden: true,
        permissions: ['biz:inspSiteInfo:see'],
        children: [
            // {
            //     path: 'inspSiteInfo',
            //     component: () => import('@/views/biz/inspSiteInfo/index'),
            //     name: 'inspSiteInfo',
            //     meta: { title: '站点信息', activeMenu: '/tool/gen' }
            // },
            {
                path: 'mediaUpdateInfo',
                component: () => import('@/views/media/mediaUpdate/info'),
                name: 'mediaUpdateInfo',
                meta: { title: '账号更新详情', activeMenu: '/mediaDate/mediaUpdate'}
            }
        ]
    },
    /**预警中心 */
    {
        path: '/warn',
        component: Layout,
        hidden: true,
        permissions: ['warn:warnMonitor:log'],
        
        children: [
            // 预警日志
            {
                path: 'warnSendLog',
                component: () => import('@/views/warn/warnMonitor/warnSendLog'),
                name: 'warnSendLog',
                meta: { title: '策略日志', activeMenu: '/warn/warnSendLog'}
            },
            // 异常日志
            {
                path: 'warnFailSendLog',
                component: () => import('@/views/warn/warnMonitor/warnFailSendLog'),
                name: 'warnFailSendLog',
                meta: { title: '异常日志', activeMenu: '/warn/warnFailSendLog'}
            },
            // 首页未更新
            {
                path: 'homePageUpdate',
                component: () => import('@/views/warn/homePageUpdate'),
                name: 'homePageUpdate',
                meta: { title: '首页未更新'}
            },
            // 错误、敏感、隐私
            {
                path: 'wrongWords',
                component: () => import('@/views/warn/wrongWords'),
                name: 'wrongWords',
                meta: { title: '错敏隐私'}
            },
        ]
    },
    /**外链审核 */
    {
        path: '/externalLinks',
        component: Layout,
        hidden: true,
        permissions: ['biz:externalLinksRule:see'],
        children: [
            {
                path: 'externalLinksRuleLog',
                component: () => import('@/views/biz/externalLinksRule/log'),
                name: 'externalLinksRuleLog',
                meta: { title: '规则日志', activeMenu: '/externalLinks/externalLinksRule'}
            },
            {
                path: 'externalLinksRuleLogInfo',
                component: () => import('@/views/biz/externalLinksRule/logInfo'),
                name: 'externalLinksRuleLogInfo',
                meta: { title: '规则日志详情', activeMenu: '/externalLinks/externalLinksRule'}
            }
        ]
    },
    /**复核任务 */
    {
        path: '/review',
        component: Layout,
        hidden: true,
        permissions: ['biz:review:see'],
        children: [
            {
                path: 'reviewTaskInfo',
                component: () => import('@/views/reviewTask/info'),
                name: 'reviewTaskInfo',
                meta: { title: '任务详情', activeMenu: '/review/index'}
            },
            {
                path: 'indexChildren',
                component: () => import('@/views/reviewTask/indexChildren'),
                name: 'indexChildren',
                meta: { title: '子任务', activeMenu: '/review/index'}
            },
        ]
    },
    
    // review/reviewTaskInfo
    /**采集管理-页面采集 */
    // {
    //     // collect/pagesIndex
    //     path: '/collect',
    //     component: Layout,
    //     hidden: true,
    //     permissions: ['biz:pagesIndexInfo:see'],
    //     children: [
    //         {
    //             path: 'pagesIndexInfo',
    //             component: () => import('@/views/biz/pagesIndex/info'),
    //             name: 'pagesIndexInfo',
    //             meta: { title: '采集排查', activeMenu: '/collect/pagesIndex'}
    //         },
    //     ]
    // },
]

// 防止连续点击多次路由报错
let routerPush = Router.prototype.push;
let routerReplace = Router.prototype.replace;
// push
Router.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(err => err)
}
// replace
Router.prototype.replace = function push(location) {
    return routerReplace.call(this, location).catch(err => err)
}

export default new Router({
    mode: 'hash', // 去掉url中的#
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})
