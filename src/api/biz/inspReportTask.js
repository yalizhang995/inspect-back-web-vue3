import request from '@/utils/request'

// 查询报告任务列表
export function listInspReportTask(data) {
    return request({
        url: '/biz/inspReportTask/list',
        method: 'post',
        data: data
    })
}

// 查询报告任务详细
export function getInspReportTask(data) {
    return request({
        url: '/biz/inspReportTask/getInfo',
        method: 'post',
        data: data
    })
}

// 新增报告任务
export function addInspReportTask(data) {
    return request({
        url: '/biz/inspReportTask/add',
        method: 'post',
        data: data
    })
}

// 修改报告任务
export function updateInspReportTask(data) {
    return request({
        url: '/biz/inspReportTask/edit',
        method: 'post',
        data: data
    })
}

// 删除报告任务
export function delInspReportTask(data) {
    return request({
        url: '/biz/inspReportTask/remove',
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


// 生成报告
export function updateCreateReportState(data) {
    return request({
        url: '/biz/inspReportTask/updateCreateReportState',
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

// 采集加急
export function addVip(data) {
    return request({
        url: '/biz/inspReportTask/addVip',
        method: 'post',
        data: data
    })
}