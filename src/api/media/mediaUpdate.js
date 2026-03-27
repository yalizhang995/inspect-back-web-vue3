import request from '@/utils/request'

// 查询站点信息列表
export function listInspSiteInfo(data) {
    return request({
        url: '/biz/mediaUpdate/list',
        method: 'post',
        data: data
    })
}
// 详情
export function getInfo(data) {
    return request({
        url: '/biz/mediaUpdate/getInfo',
        method: 'post',
        data: data
    })
}
// 修改
export function updateInspSiteInfo(data) {
    return request({
        url: '/biz/mediaUpdate/edit',
        method: 'post',
        data: data
    })
}
// 查询站点信息详细
export function getImediaArticleInfo(data) {
    return request({
        url: '/biz/mediaArticleInfo/list',
        method: 'post',
        data: data
    })
}
// 获取未更新天数
export function queryNoUpdateDay(data) {
    return request({
        url: '/biz/mediaUpdate/queryNoUpdateDay',
        method: 'post',
        data: data
    })
}