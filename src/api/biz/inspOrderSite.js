import request from '@/utils/request'

// 查询订单站点关联列表
export function listInspOrderSite(data) {
    return request({
        url: '/biz/inspOrderSite/list',
        method: 'post',
        data: data
    })
}

// 查询订单站点关联详细
export function getInspOrderSite(data) {
    return request({
        url: '/biz/inspOrderSite/getInfo',
        method: 'post',
        data: data
    })
}

// 新增订单站点关联
export function addInspOrderSite(data) {
    return request({
        url: '/biz/inspOrderSite/add',
        method: 'post',
        data: data
    })
}

// 修改订单站点关联
export function updateInspOrderSite(data) {
    return request({
        url: '/biz/inspOrderSite/edit',
        method: 'post',
        data: data
    })
}

// 删除订单站点关联
export function delInspOrderSite(data) {
    return request({
        url: '/biz/inspOrderSite/remove',
        method: 'post',
        data: data
    })
}

// 站点范围-新增网站标识码
export function addBatch(data) {
    return request({
        url: '/biz/inspOrderSite/addBatch',
        method: 'post',
        data: data
    })
}
