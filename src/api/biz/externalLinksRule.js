import request from '@/utils/request'

// 查询站点信息列表
export function listInspSite(data) {
    return request({
        url: '/biz/externalLinksRule/list',
        method: 'post',
        data: data
    })
}

// 查询站点信息列表
export function getInfo(data) {
    return request({
        url: '/biz/externalLinksRule/getInfo',
        method: 'post',
        data: data
    })
}

// 外链规则校验 
export function verify(data) {
    return request({
        url: '/biz/externalLinksRule/verify',
        method: 'post',
        data: data
    })
}

// 新增站点信息列表
export function addInfo(data) {
    return request({
        url: '/biz/externalLinksRule/add',
        method: 'post',
        data: data
    })
}

// 编辑站点信息列表
export function editInfo(data) {
    return request({
        url: '/biz/externalLinksRule/edit',
        method: 'post',
        data: data
    })
}

// 日志
export function logList(data) {
    return request({
        url: '/biz/externalLinksRule/logList',
        method: 'post',
        data: data
    })
}

// 免检列表
export function externalExemption(data) {
    return request({
        url: '/biz/externalExemption/list',
        method: 'post',
        data: data
    })
}

// 黑白名单规则日志详情
export function getLogDetails(data) {
    return request({
        url: '/biz/externalLinksRule/logDetails',
        method: 'post',
        data: data
    })
}

// 状态 启用、禁用
export function upEnabled(data) {
    return request({
        url: '/biz/externalLinksRule/enabled',
        method: 'post',
        data: data
    })
}

// 外链任务
export function externalLinksTask(data) {
    return request({
        url: '/biz/externalLinksTask/list',
        method: 'post',
        data: data
    })
}

// 外链日志
export function externalLinksLog(data) {
    return request({
        url: '/biz/externalLinksRuleLog/list',
        method: 'post',
        data: data
    })
}

export function expressionVerify(data) {
    return request({
        url: '/biz/externalLinksRule/expressionVerify',
        method: 'post',
        data: data
    })
}