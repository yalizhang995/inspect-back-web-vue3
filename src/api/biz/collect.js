import request from '@/utils/request'

// 采集记录列表
export function pagesProxy(data) {
    return request({
        url: '/biz/pagesProxy/list',
        method: 'post',
        data: data
    })
}

// 日常统计列表
export function collectionStats(data) {
    return request({
        url: '/biz/collectionStats/list',
        method: 'post',
        data: data
    })
}

// 全站统计列表
export function allSiteStats(data) {
    return request({
        url: '/biz/allSiteStats/list',
        method: 'post',
        data: data
    })
}

// 栏目稿件
export function getChannelArticlesSummary(data) {
    return request({
        url: '/biz/channelArticlesSummary/list',
        method: 'post',
        data: data
    })
}
// 栏目稿件-详情
export function getInfoChannelArticlesSummary(data) {
    return request({
        url: '/biz/channelArticlesSummary/getInfo',
        method: 'post',
        data: data
    })
}
// 栏目稿件-修改状态
export function editChannelArticlesSummary(data) {
    return request({
        url: '/biz/channelArticlesSummary/edit',
        method: 'post',
        data: data
    })
}

// 栏目稿件-重新采集
export function batchReSampling(data) {
    return request({
        url: '/biz/channelArticlesSummary/batchReSampling',
        method: 'post',
        data: data
    })
}