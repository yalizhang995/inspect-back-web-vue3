import request from '@/utils/request'

// 问题反馈列表
export function getList(data) {
    return request({
        url: '/biz/inspFeedback/list',
        method: 'post',
        data: data
    })
}
// 添加
export function inspFeedbackAdd(data) {
    return request({
        url: '/biz/inspFeedback/add',
        method: 'post',
        data: data
    })
}
// 修改
export function inspFeedbackEdit(data) {
    return request({
        url: '/biz/inspFeedback/edit',
        method: 'post',
        data: data
    })
}
// 全部已读
export function readAll(data) {
    return request({
        url: '/biz/inspFeedback/readAll',
        method: 'post',
        data: data
    })
}
// 详情
export function getInfo(data) {
    return request({
        url: '/biz/inspFeedback/getInfo',
        method: 'post',
        data: data
    })
}
