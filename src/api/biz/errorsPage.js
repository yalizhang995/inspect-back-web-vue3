import request from '@/utils/request'

// 查询站点信息列表
export function listInspSiteInfo(data) {
    return request({
        url: '/biz/errors/list',
        method: 'post',
        data: data
    })
}

// 查询站点信息详细
export function getInspSiteInfo(data) {
    return request({
        url: '/biz/errors/getInfo',
        method: 'post',
        data: data
    })
}

// 新增站点信息
export function addInspSiteInfo(data) {
    return request({
        url: '/biz/errors/add',
        method: 'post',
        data: data
    })
}

// 修改站点信息
export function updateInspSiteInfo(data) {
    return request({
        url: '/biz/errors/edit',
        method: 'post',
        data: data
    })
}

// 删除站点信息
export function delInspSiteInfo(data) {
    return request({
        url: '/biz/errors/remove',
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

//   整改状态
export function editReviewResult(data) {
    return request({
        url: '/biz/errors/editReviewResult',
        method: 'post',
        data: data
    })
}

// 批量整改
export function editReviewResultBatch(data) {
    return request({
      url: '/biz/errors/editReviewResultBatch',
      method: 'post',
      data: data
    })
}