import request from '@/utils/request'

// 查询审核数据回导任务列表
export function listInspImportdataTask(data) {
    return request({
        url: '/biz/inspImportdataTask/list',
        method: 'post',
        data: data
    })
}

// 查询审核数据回导任务详细
export function getInspImportdataTask(data) {
    return request({
        url: '/biz/inspImportdataTask/getInfo',
        method: 'post',
        data: data
    })
}

// 新增审核数据回导任务
export function addInspImportdataTask(data) {
    return request({
        url: '/biz/inspImportdataTask/add',
        method: 'post',
        data: data
    })
}

// 修改审核数据回导任务
export function updateInspImportdataTask(data) {
    return request({
        url: '/biz/inspImportdataTask/edit',
        method: 'put',
        data: data
    })
}

// 删除审核数据回导任务
export function delInspImportdataTask(data) {
    return request({
        url: '/biz/inspImportdataTask/remove',
        method: 'post',
        data: data
    })
}
