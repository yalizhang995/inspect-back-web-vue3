import request from '@/utils/request'

// 查询站点信息列表
export function listInspSiteInfo(data) {
    return request({
        url: '/biz/externalLinks/list',
        method: 'post',
        data: data,
        timeout: 300000 // 单独设置这个请求的超时时间为5分钟
    })
}

// 查询站点信息详细
export function getInspSiteInfo(data) {
    return request({
        url: '/biz/externalLinks/getInfo',
        method: 'post',
        data: data
    })
}

// 新增站点信息
export function addInspSiteInfo(data) {
    return request({
        url: '/biz/externalLinks/add',
        method: 'post',
        data: data
    })
}

// 修改站点信息
export function updateInspSiteInfo(data) {
    return request({
        url: '/biz/externalLinks/edit',
        method: 'post',
        data: data
    })
}

// 删除站点信息
export function delInspSiteInfo(data) {
    return request({
        url: '/biz/externalLinks/remove',
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
        url: '/biz/externalLinks/editReviewResult',
        method: 'post',
        data: data
    })
}

//   域名删除
export function deleteByDomain(data) {
    return request({
        url: '/biz/externalLinks/deleteByDomain',
        method: 'post',
        data: data
    })
}

// 批量整改
export function editReviewResultBatch(data) {
    return request({
      url: '/biz/externalLinks/editReviewResultBatch',
      method: 'post',
      data: data
    })
}

// 信任链接
export function editExternalLinksTrust(data) {
    return request({
      url: '/biz/externalLinks/editExternalLinksTrust',
      method: 'post',
      data: data
    })
}

// 批量预警
export function editWarnBatch(data) {
    return request({
      url: '/biz/externalLinks/editWarnBatch',
      method: 'post',
      data: data
    })
}
