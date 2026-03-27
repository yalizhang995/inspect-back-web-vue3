import request from '@/utils/request'

// 查询爬虫任务列表
export function listColumn(data) {
    return request({
        url: '/biz/column/list',
        method: 'post',
        data: data
    })
}

// 查询爬虫任务详细
export function getColumn(data) {
    return request({
        url: '/biz/column/getInfo',
        method: 'post',
        data: data
    })
}

// 新增爬虫任务
export function addColumn(data) {
    return request({
        url: '/biz/column/add',
        method: 'post',
        data: data
    })
}

// 修改爬虫任务
export function updateColumn(data) {
    return request({
        url: '/biz/column/edit',
        method: 'post',
        data: data
    })
}

// 删除爬虫任务
export function delColumn(data) {
    return request({
        url: '/biz/column/remove',
        method: 'post',
        data: data
    })
}

// 导出爬虫任务
export function exportChannel(data) {
    return request({
        url: '/biz/column/export',
        method: 'post',
        data: data
    })
}

// 查看网站标识码是否存在
export function siteInfoExist(data) {
    return request({
        url: '/biz/inspSiteInfo/siteInfoExist',
        method: 'post',
        data: data
    })
}

/**
 * 操作-高级
 */
// 修改底部标识信息
export function editWebsiteCode(data) {
    return request({
        url: '/biz/column/editWebsiteCode',
        method: 'post',
        data: data
    })
}

// 修改采集范围、不采集范围
export function editRuleUrlPatterns(data) {
    return request({
        url: '/biz/column/editRuleUrlPatterns',
        method: 'post',
        data: data
    })
}

// 修改模拟点击事件
export function editOnClick(data) {
    return request({
        url: '/biz/column/editOnClick',
        method: 'post',
        data: data
    })
}

// 修改Cookie的信息
export function editCookies(data) {
    return request({
        url: '/biz/column/editCookies',
        method: 'post',
        data: data
    })
}

// 修改自定义抽取规则
export function editRules(data) {
    return request({
        url: '/biz/column/editRules',
        method: 'post',
        data: data
    })
}

// 重新采集
export function spiderTaskInit(data) {
    return request({
        url: '/biz/column/recapture',
        method: 'post',
        data: data
    })
}

// 个性化采集规则公共接口
export function editCustomRules(data) {
    return request({
        url: '/biz/column/editCustomRules',
        method: 'post',
        data: data
    })
}

// 采集加急
export function addVip(data) {
    return request({
        url: '/biz/column/addVip',
        method: 'post',
        data: data
    })
}
// 采集加急日志
export function columnLog(data) {
    return request({
        url: '/biz/spiderTaskVipLog/list',
        method: 'post',
        data: data
    })
}


