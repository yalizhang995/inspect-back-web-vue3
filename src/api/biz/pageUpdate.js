import request from '@/utils/request'

// 查询站点信息列表
export function listInspSiteInfo(data) {
    return request({
        url: '/biz/pageUpdate/list',
        method: 'post',
        data: data
    })
}

// 查询站点信息详细
export function getInspSiteInfo(data) {
    return request({
        url: '/biz/pageUpdate/getInfo',
        method: 'post',
        data: data
    })
}

// 新增站点信息
export function addInspSiteInfo(data) {
    return request({
        url: '/biz/pageUpdate/add',
        method: 'post',
        data: data
    })
}

// 修改站点信息
export function updateInspSiteInfo(data) {
    return request({
        url: '/biz/pageUpdate/edit',
        method: 'post',
        data: data
    })
}

// 删除站点信息
export function delInspSiteInfo(data) {
    return request({
        url: '/biz/pageUpdate/remove',
        method: 'post',
        data: data
    })
}

// 批次列表
export function getOrderBatchSelectList(data) {
    return request({
        url: '/biz/inspOrderBatch/orderBatchSelectList',
        method: 'post',
        data: data
    })
}

//   整改状态
export function editReviewResult(data) {
    return request({
        url: '/biz/pageUpdate/editReviewResult',
        method: 'post',
        data: data
    })
}

// 获取未更新天数
export function queryNoUpdateDay(data) {
    return request({
        url: '/biz/pageUpdate/queryNoUpdateDay',
        method: 'post',
        data: data
    })
}

// 查询栏目分类列表
export function listInspChannelType(data) {
    return request({
        url: '/biz/inspChannelType/list',
        method: 'post',
        data: data
    })
}

// 重新采集（单个、批量）
export function batchReSampling(data) {
    return request({
        url: '/biz/pageUpdate/batchReSampling',
        method: 'post',
        data: data
    })
}