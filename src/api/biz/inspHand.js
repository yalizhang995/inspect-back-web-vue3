import request from '@/utils/request'

// 查询人工录入问题列表
export function listInspHand(data) {
    return request({
        url: '/biz/inspHand/list',
        method: 'post',
        data: data
    })
}

// 查询人工录入问题详细
export function getInspHand(data) {
    return request({
        url: '/biz/inspHand/getInfo',
        method: 'post',
        data: data
    })
}

// 新增人工录入问题
export function addInspHand(data) {
    return request({
        url: '/biz/inspHand/add',
        method: 'post',
        data: data
    })
}

// 修改人工录入问题
export function updateInspHand(data) {
    return request({
        url: '/biz/inspHand/edit',
        method: 'post',
        data: data
    })
}

// 删除人工录入问题
export function delInspHand(data) {
    return request({
        url: '/biz/inspHand/remove',
        method: 'post',
        data: data
    })
}

// 查询指标列表
export function listInspNorm(data) {
    return request({
        url: '/biz/inspNorm/list',
        method: 'post',
        data: data
    })
}