import request from '@/utils/request'

// 查询用户站点关联列表
export function listInspUserSite(data) {
    return request({
        url: '/biz/inspUserSite/list',
        method: 'post',
        data: data
    })
}

// 查询用户站点关联详细
export function getInspUserSite(data) {
    return request({
        url: '/biz/inspUserSite/getInfo',
        method: 'post',
        data: data
    })
}

// 新增用户站点关联
export function addInspUserSite(data) {
    return request({
        url: '/biz/inspUserSite/add',
        method: 'post',
        data: data
    })
}

// 修改用户站点关联
export function updateInspUserSite(data) {
    return request({
        url: '/biz/inspUserSite/edit',
        method: 'post',
        data: data
    })
}

// 删除用户站点关联
export function delInspUserSite(data) {
    return request({
        url: '/biz/inspUserSite/remove',
        method: 'post',
        data: data
    })
}

// 用户模糊搜索
export function queryList(data) {
    return request({
        url: '/system/user/queryList',
        method: 'post',
        data: data
    })
}

// 网站标识码模糊搜索
export function siteQueryList(data) {
    return request({
        url: '/biz/inspSiteInfo/queryList',
        method: 'post',
        data: data
    })
}
