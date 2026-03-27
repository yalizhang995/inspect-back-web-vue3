import request from '@/utils/request'
// 查询订单流转列表
export function listInspOrderFlow(data) {
    return request({
        url: '/crm/crmOrder/list',
        method: 'post',
        data: data
    })
}

// 查询订单流转详情
export function getInspOrderFlowInfo(data) {
    return request({
        url: '/crm/crmOrder/getInfo',
        method: 'post',
        data: data
    })
}
// 订单流转详情==签收
export function receivedOrderFlow(data) {
    return request({
        url: '/crm/crmOrder/received',
        method: 'post',
        data: data
    })
}


// 新增订单流转
export function addInspOrderFlow(data) {
    return request({
        url: '/crm/crmOrder/add',
        method: 'post',
        data: data
    })
}

// 修改订单流转
export function updateInspOrderFlow(data) {
    return request({
        url: '/crm/crmOrder/edit',
        method: 'post',
        data: data
    })
}

// 删除订单流转
export function delInspOrderFlow(data) {
    return request({
        url: '/crm/crmOrder/remove',
        method: 'post',
        data: data
    })
}
