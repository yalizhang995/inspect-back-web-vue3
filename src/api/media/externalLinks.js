import request from '@/utils/request'

// 查询站点信息列表
export function listInspSiteInfo(data) {
    return request({
        url: '/biz/mediaExternalLinks/list',
        method: 'post',
        data: data
    })
}

// 查询站点信息详细
export function getInspSiteInfo(data) {
    return request({
        url: '/biz/mediaExternalLinks/getInfo',
        method: 'post',
        data: data
    })
}

// 新增站点信息
export function addInspSiteInfo(data) {
    return request({
        url: '/biz/mediaExternalLinks/add',
        method: 'post',
        data: data
    })
}

// 修改站点信息
export function updateInspSiteInfo(data) {
    return request({
        url: '/biz/mediaExternalLinks/update',
        method: 'post',
        data: data
    })
}

// 删除站点信息
export function delInspSiteInfo(data) {
    return request({
        url: '/biz/mediaExternalLinks/remove',
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
        url: '/biz/mediaExternalLinks/editReviewResult',
        method: 'post',
        data: data
    })
}

//   域名删除
export function deleteByDomain(data) {
    return request({
        url: '/biz/mediaExternalLinks/deleteByDomain',
        method: 'post',
        data: data
    })
}

// 批量整改
export function editReviewResultBatch(data) {
    return request({
      url: '/biz/mediaExternalLinks/editReviewResultBatch',
      method: 'post',
      data: data
    })
}

// 信任链接
export function editExternalLinksTrust(data) {
    return request({
      url: '/biz/mediaExternalLinks/trust',
      method: 'post',
      data: data
    })
}

// 批量预警
export function editWarnBatch(data) {
    return request({
      url: '/biz/mediaExternalLinks/editWarnBatch',
      method: 'post',
      data: data
    })
}

