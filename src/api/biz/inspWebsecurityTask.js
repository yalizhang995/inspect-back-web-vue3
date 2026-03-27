import request from '@/utils/request'

// 查询网站安全任务列表
export function listInspWebsecurityTask(data) {
    return request({
        url: '/biz/inspWebsecurityTask/list',
        method: 'post',
        data: data
    })
}

// 查询网站安全任务详细
export function getInspWebsecurityTask(data) {
    return request({
        url: '/biz/inspWebsecurityTask/getInfo',
        method: 'post',
        data: data
    })
}

// 新增网站安全任务
export function addInspWebsecurityTask(data) {
    return request({
        url: '/biz/inspWebsecurityTask/add',
        method: 'post',
        data: data
    })
}

// 修改网站安全任务
export function updateInspWebsecurityTask(data) {
    return request({
        url: '/biz/inspWebsecurityTask/edit',
        method: 'post',
        data: data
    })
}

// 删除网站安全任务
export function delInspWebsecurityTask(data) {
    return request({
        url: '/biz/inspWebsecurityTask/remove',
        method: 'post',
        data: data
    })
}

// 操作监测状态
export function operation(data) {
    return request({
        url: '/biz/inspWebsecurityTask/operation',
        method: 'post',
        data: data
    })
}