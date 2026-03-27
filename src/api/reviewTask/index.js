import request from '@/utils/request'

// 列表
export function getReviewTaskList(data) {
    return request({
      url: '/biz/reviewTask/list',
      method: 'post',
      data: data
    })
}
// 添加
export function reviewTaskAdd(data) {
    return request({
      url: '/biz/reviewTask/add',
      method: 'post',
      data: data
    })
}
// 结束
export function reviewTaskEnd(data) {
    return request({
      url: '/biz/reviewTask/end',
      method: 'post',
      data: data
    })
}
// 详情
export function getDetailList(data) {
    return request({
      url: '/biz/reviewTask/detailList',
      method: 'post',
      data: data
    })
}
// 整改-外链
export function wlEditReviewResult(data) {
    return request({
        url: '/biz/externalLinks/editReviewResult',
        method: 'post',
        data: data
    })
}
// 整改-错链
export function clEditReviewResult(data) {
    return request({
        url: '/biz/errors/editReviewResult',
        method: 'post',
        data: data
    })
}
// 整改-错误
export function cwEditReviewResult(data) {
    return request({
        url: '/biz/wrongWordsBase/editReviewResult',
        method: 'post',
        data: data
    })
}
// 整改-敏感
export function mgEditReviewResult(data) {
    return request({
        url: '/biz/sensitiveWords/editReviewResult',
        method: 'post',
        data: data
    })
}
// 整改-隐私
export function ysEditReviewResult(data) {
    return request({
        url: '/biz/privacyLeaks/editReviewResult',
        method: 'post',
        data: data
    })
}