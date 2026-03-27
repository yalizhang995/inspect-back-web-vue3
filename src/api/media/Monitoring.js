import request from '@/utils/request'
// 列表
export function listInspSiteInfo(data) {
    return request({
        url: '/biz/mediaArticleInfo/list',
        method: 'post',
        data: data
    })
}
// 详情
export function getInfo(data) {
    return request({
        url: '/biz/mediaArticleInfo/getInfo',
        method: 'post',
        data: data
    })
}

// 获取站点关系
export function getInspSiteTreeList(data) {
    return request({
      url: '/biz/inspSiteTree/listQuery',
      method: 'post',
      data: data
    })
}
// 统计
export function groupByOverdueState(data) {
    return request({
        url: '/biz/externalLinks/groupByLinkLocation',
        method: 'post',
        data: data
    })
}
