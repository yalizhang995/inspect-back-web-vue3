import request from '@/utils/request'

// 查询订单批次列表
export function listInspOrderBatch(data) {
    return request({
        url: '/biz/inspOrderBatch/list',
        method: 'post',
        data: data
    })
}

// 查询订单批次详细
export function getInspOrderBatch(data) {
    return request({
        url: '/biz/inspOrderBatch/getInfo',
        method: 'post',
        data: data
    })
}

// 新增订单批次
export function addInspOrderBatch(data) {
    return request({
        url: '/biz/inspOrderBatch/add',
        method: 'post',
        data: data
    })
}

// 修改订单批次
export function updateInspOrderBatch(data) {
    return request({
        url: '/biz/inspOrderBatch/edit',
        method: 'post',
        data: data
    })
}

// 删除订单批次
export function delInspOrderBatch(data) {
    return request({
        url: '/biz/inspOrderBatch/remove',
        method: 'post',
        data: data
    })
}
// 查询订单批次列表
export function inspOrderBatchQueryList(data) {
    return request({
        url: '/biz/inspOrderBatch/queryList',
        method: 'post',
        data: data
    })
}
// 重新采集
export function spiderTaskInit(data) {
    return request({
        url: '/biz/inspOrderBatch/spiderTaskInit',
        method: 'post',
        data: data
    })
}
// 批次-站点关系树
export function selectInspSiteTreeOrderSiteList(data) {
    return request({
        url: '/biz/inspSiteTree/selectInspSiteTreeOrderSiteList',
        method: 'post',
        data: data
    })
}
// 批次-站点详情
export function inspOrderSiteInfo(data) {
    return request({
        url: '/biz/inspOrderSite/list',
        method: 'post',
        data: data
    })
}

// 采集加急
export function addVip(data) {
    return request({
        url: '/biz/inspOrderBatch/addVip',
        method: 'post',
        data: data
    })
}




