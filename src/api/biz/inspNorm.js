import request from '@/utils/request'

// 查询指标列表
export function listInspNorm(data) {
    return request({
        url: '/biz/inspNorm/list',
        method: 'post',
        data: data
    })
}

// 查询指标详细
export function getInspNorm(data) {
    return request({
        url: '/biz/inspNorm/getInfo',
        method: 'post',
        data: data
    })
}

// 新增指标
export function addInspNorm(data) {
    return request({
        url: '/biz/inspNorm/add',
        method: 'post',
        data: data
    })
}

// 修改指标
export function updateInspNorm(data) {
    return request({
        url: '/biz/inspNorm/edit',
        method: 'post',
        data: data
    })
}

// 删除指标
export function delInspNorm(data) {
    return request({
        url: '/biz/inspNorm/remove',
        method: 'post',
        data: data
    })
}
