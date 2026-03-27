import request from '@/utils/request'
/**首页更新 */

// 获取站点关系
export function getInspSiteTreeList(data) {
    return request({
        url: '/biz/inspSiteTree/list',
        method: 'post',
        data: data
    })
}
// 列表
export function getList(data) {
    return request({
        url: '/biz/articlesSummary/list',
        method: 'post',
        data: data
    })
}

// 详情
export function getInfo(data) {
    return request({
        url: '/biz/articlesSummary/getInfo',
        method: 'post',
        data: data
    })
}
// 详情列表
export function getInfoList(data) {
    return request({
        url: '/biz/articles/list',
        method: 'post',
        data: data
    })
}
// 详情列表
export function delInspSiteInfo(data) {
    return request({
        url: '/biz/articles/remove',
        method: 'post',
        data: data
    })
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
    return request({
        url: '/system/dict/data/type/' + dictType,
        method: 'get'
    })
}

// 问题类型枚举
export function articleQuestionType(data) {
    return request({
        url: '/system/dict/data/articleQuestionType',
        method: 'post',
        data: data
    })
}

// 重新采集
export function recollect(data) {
    return request({
        url: '/biz/articles/recollect',
        method: 'post',
        data: data
    })
}
// 稿件重采
export function recollectChannel(data) {
    return request({
        url: '/biz/articles/recollectChannel',
        method: 'post',
        data: data
    })
}





