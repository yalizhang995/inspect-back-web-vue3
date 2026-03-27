import request from '@/utils/request'

// 查询站点关系列表
export function listInspSiteTree(data) {
    return request({
        url: '/biz/inspSiteTree/list',
        method: 'post',
        data: data
    })
}

// 查询站点关系详细
export function getInspSiteTree(data) {
    return request({
        url: '/biz/inspSiteTree/getInfo',
        method: 'post',
        data: data
    })
}

// 新增站点关系
export function addInspSiteTree(data) {
    return request({
        url: '/biz/inspSiteTree/add',
        method: 'post',
        data: data
    })
}

// 修改站点关系
export function updateInspSiteTree(data) {
    return request({
        url: '/biz/inspSiteTree/edit',
        method: 'post',
        data: data
    })
}

// 删除站点关系
export function delInspSiteTree(data) {
    return request({
        url: '/biz/inspSiteTree/remove',
        method: 'post',
        data: data
    })
}

// 导入记录
export function siteTreeImportRecord(data) {
    return request({
        url: '/biz/inspImportdataTask/siteTreeImportRecord',
        method: 'post',
        data: data
    })
}

// 查询站点关系列表
export function listTable(data) {
    return request({
        url: '/biz/inspSiteTree/listTable',
        method: 'post',
        data: data
    })
}

// 查询站点信息-新媒体
export function SearchMediaInfo(data) {
    return request({
        url: '/biz/inspMediaInfo/list',
        method: 'post',
        data: data
    })
}
