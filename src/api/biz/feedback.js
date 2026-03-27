import request from '@/utils/request'

// 问题反馈列表
export function getList(data) {
    return request({
        url: '/biz/inspFeedback/list',
        method: 'post',
        data: data
    })
}
// 添加
export function inspFeedbackAdd(data) {
    return request({
        url: '/biz/inspFeedback/add',
        method: 'post',
        data: data
    })
}
// 修改
export function inspFeedbackEdit(data) {
    return request({
        url: '/biz/inspFeedback/edit',
        method: 'post',
        data: data
    })
}
// 全部已读
export function readAll(data) {
    return request({
        url: '/biz/inspFeedback/readAll',
        method: 'post',
        data: data
    })
}
// 详情
export function getInfo(data) {
    return request({
        url: '/biz/inspFeedback/getInfo',
        method: 'post',
        data: data
    })
}
// 删除
export function delInspSiteInfo(data) {
    return request({
        url: '/biz/inspFeedback/remove',
        method: 'post',
        data: data
    })
}

/**网站 */
// 查询站点信息详细-错误内容、敏感信息、隐私泄露、图片、视频、音频、附件监测
export function wrongWordsInfo(data) {
    return request({
        url: '/biz/wrongWords/getInfo',
        method: 'post',
        data: data
    })
}

// 查询站点信息详细-错链信息
export function errorsInfo(data) {
    return request({
        url: '/biz/errors/getInfo',
        method: 'post',
        data: data
    })
}
// 查询站点信息详细-外链信息
export function externalLinksInfo(data) {
    return request({
        url: '/biz/externalLinks/getInfo',
        method: 'post',
        data: data
    })
}
// 查询站点信息详细-首页更新
export function pageUpdateInfo(data) {
    return request({
        url: '/biz/pageUpdate/getInfo',
        method: 'post',
        data: data
    })
}
// 查询站点信息详细-栏目更新
export function lmPageUpdateInfo(data) {
    return request({
        url: '/biz/pageUpdate/getInfo',
        method: 'post',
        data: data
    })
}
// 查询站点信息详细-规范检查
export function requiresInfo(data) {
    return request({
        url: '/biz/requires/getInfo',
        method: 'post',
        data: data
    })
}
// 规范检查-枚举数据
export function getSpecsMapEnum(data) {
    return request({
        url: '/biz/requires/specsMapEnum',
        method: 'post',
        data: data
    })
}
// 查询站点信息详细-首页连通
export function linksSummaryInfo(data) {
    return request({
        url: '/biz/linksSummary/getInfo',
        method: 'post',
        data: data
    })
}

/**新媒体 */
// 查询站点信息详细-错误内容、敏感信息、隐私泄露、图片、视频、音频、附件监测
export function mediaWrongWordsInfo(data) {
    return request({
        url: '/biz/mediaWrongWords/getInfo',
        method: 'post',
        data: data
    })
}
// 查询站点信息详细-外链信息
export function mediaExternalLinksInfo(data) {
    return request({
        url: '/biz/mediaExternalLinks/getInfo',
        method: 'post',
        data: data
    })
}
// 账号更新-详情
export function mediaUpdateInfo(data) {
    return request({
      url: '/biz/mediaUpdate/getInfo',
      method: 'post',
      data: data
    })
  }