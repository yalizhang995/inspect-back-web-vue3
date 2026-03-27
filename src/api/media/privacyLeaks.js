import request from '@/utils/request'

// 查询站点信息列表
export function listInspSiteInfo(data) {
    return request({
        url: '/biz/mediaPrivacyLeaks/list',
        method: 'post',
        data: data
    })
}

// 查询站点信息详细
export function getInspSiteInfo(data) {
    return request({
        url: '/biz/mediaPrivacyLeaks/getInfo',
        method: 'post',
        data: data
    })
}

// 新增站点信息
export function addInspSiteInfo(data) {
    return request({
        url: '/biz/mediaPrivacyLeaks/add',
        method: 'post',
        data: data
    })
}

// 修改站点信息
export function updateInspSiteInfo(data) {
    return request({
        url: '/biz/mediaPrivacyLeaks/edit',
        method: 'post',
        data: data
    })
}

// 删除站点信息
export function delInspSiteInfo(data) {
    return request({
        url: '/biz/mediaPrivacyLeaks/remove',
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
        url: '/biz/mediaPrivacyLeaks/editReviewResult',
        method: 'post',
        data: data
    })
}

// 类型枚举
export function wrongWordsEnumMap(data) {
    return request({
      url: '/biz/custom/wrongWordsEnumMap',
      method: 'post',
      data: data
    })
}
/**隐私泄露 */
// 枚举数据
export function getPrivacyBreachMap(data) {
    return request({
    //   url: '/biz/inspOrderBatch/list',
      url: '/biz/wrongWords/privacyBreachMap',
      method: 'post',
      data: data
    })
}

// 批量修改状态
export function editBatch(data) {
    return request({
      url: '/biz/mediaPrivacyLeaks/editBatch',
      method: 'post',
      data: data
    })
}
// 批量整改
export function editReviewResultBatch(data) {
    return request({
      url: '/biz/mediaPrivacyLeaks/editReviewResultBatch',
      method: 'post',
      data: data
    })
}

// 模板上传
export function batchImport(data) {
    return request({
        // url: '/biz/inspSiteXmt/batchImport',
        url: '/biz/mediaPrivacyLeaks/batchImport',
        method: 'post',
        data: data
    })
}

// 导入模板
export function inspImportdataTask(data) {
    return request({
        url: '/biz/inspImportdataTask/batchImport',
        method: 'post',
        data: data
    })
}
// 模版下载
export function downloadExcelTpl() {
    return request({
        url: '/common/download/downloadExcelTpl?type=1',
        method: 'get',
    })
}
// 标签分类枚举
export function getErrorType(data) {
    return request({
        // url: '/biz/inspSiteXmt/batchImport',
        url: '/biz/wrongWords/getErrorType',
        method: 'post',
        data: data
    })
}