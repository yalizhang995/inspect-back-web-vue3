import request from '@/utils/request'

// 查询站点信息列表
export function listInspSiteInfo(data) {
    return request({
        url: '/biz/requires/list',
        method: 'post',
        data: data
    })
}

// 查询站点信息详细
export function getInspSiteInfo(data) {
    return request({
        url: '/biz/requires/getInfo',
        method: 'post',
        data: data
    })
}

// 新增站点信息
export function addInspSiteInfo(data) {
    return request({
        url: '/biz/pageUpdate/add',
        method: 'post',
        data: data
    })
}

// 修改站点信息
export function updateInspSiteInfo(data) {
    return request({
        url: '/biz/requires/edit',
        method: 'post',
        data: data
    })
}

// 删除站点信息
export function delInspSiteInfo(data) {
    return request({
        url: '/biz/requires/remove',
        method: 'post',
        data: data
    })
}

// 查询栏目分类列表
export function listInspChannelType(data) {
    return request({
        url: '/biz/inspChannelType/list',
        method: 'post',
        data: data
    })
}

// 枚举数据
export function getSpecsMapEnum(data) {
    return request({
        url: '/biz/requires/specsMapEnum',
        method: 'post',
        data: data
    })
}
//   整改状态
export function editReviewResult(data) {
    return request({
        url: '/biz/requires/editReviewResult',
        method: 'post',
        data: data
    })
}
// 批量整改
export function editReviewResultBatch(data) {
    return request({
      url: '/biz/requires/editReviewResultBatch',
      method: 'post',
      data: data
    })
}