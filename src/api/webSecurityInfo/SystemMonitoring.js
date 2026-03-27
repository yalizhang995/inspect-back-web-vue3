import request from '@/utils/request'

// 列表
export function SystemMonitoringList(data) {
    return request({
        url: '/biz/webSecurityInfo/list',
        method: 'post',
        data: data
    })
}
// 详情
export function SystemMonitoringGetInfo(data) {
    return request({
        url: '/biz/webSecurityInfo/getInfo',
        method: 'post',
        data: data
    })
}
// 修改
export function SystemMonitoringEdit(data) {
    return request({
        url: '/biz/webSecurityInfo/edit',
        method: 'post',
        data: data
    })
}
// 批量审核
export function SystemMonitoringEditBatch(data) {
    return request({
        url: '/biz/webSecurityInfo/editBatch',
        method: 'post',
        data: data
    })
}

// 删除
export function SystemMonitoringRemove(data) {
    return request({
        url: '/biz/webSecurityInfo/remove',
        method: 'post',
        data: data
    })
}
// 整改
export function SystemMonitoringEditReviewResult(data) {
    return request({
        url: '/biz/webSecurityInfo/editReviewResult',
        method: 'post',
        data: data
    })
}
// 批量整改
export function SystemMonitoringEditReviewResultBatch(data) {
    return request({
        url: '/biz/webSecurityInfo/editReviewResultBatch',
        method: 'post',
        data: data
    })
}
