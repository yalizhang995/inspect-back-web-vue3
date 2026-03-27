import request from '@/utils/request'
/**首页连通性 */

/**汇总 */
// 获取站点关系
export function getInspSiteTreeList(data) {
    return request({
        url: '/biz/inspSiteTree/list',
        method: 'post',
        data: data
    })
}
// 列表
export function getList(data) {
    return request({
        url: '/biz/linksSummary/list',
        method: 'post',
        data: data
    })
}


export function getInfo(data) {
    return request({
        url: '/biz/linksSummary/getInfo',
        method: 'post',
        data: data
    })
}

// 获取总数
export function groupByConfirmProportion(data) {
    return request({
        url: '/biz/linksSummary/groupByConfirmProportion',
        method: 'post',
        data: data
    })
}

/**详情 */
// 列表
export function getInfoList(data) {
    return request({
        url: '/biz/links/list',
        method: 'post',
        data: data
    })
}

