import request from '@/utils/request'

// 查询订单信息列表
export function listInspOrderInfo(data) {
    return request({
        url: '/biz/inspOrderInfo/list',
        method: 'post',
        data: data
    })
}

// 查询订单信息详细
export function getInspOrderInfo(data) {
    return request({
        url: '/biz/inspOrderInfo/getInfo',
        method: 'post',
        data: data
    })
}

// 新增订单信息
export function addInspOrderInfo(data) {
    return request({
        url: '/biz/inspOrderInfo/add',
        method: 'post',
        data: data
    })
}

// 修改订单信息
export function updateInspOrderInfo(data) {
    return request({
        url: '/biz/inspOrderInfo/edit',
        method: 'post',
        data: data
    })
}

// 删除订单信息
export function delInspOrderInfo(data) {
    return request({
        url: '/biz/inspOrderInfo/remove',
        method: 'post',
        data: data
    })
}

// 查询订单信息列表
export function inspOrderInfoQueryList(data) {
    return request({
        url: '/biz/inspOrderInfo/queryList',
        method: 'post',
        data: data
    })
}
