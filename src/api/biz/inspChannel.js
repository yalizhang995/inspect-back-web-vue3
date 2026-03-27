import request from '@/utils/request'

// 查询栏目信息列表
export function listInspChannel(data) {
    return request({
        url: '/biz/inspChannel/list',
        method: 'post',
        data: data
    })
}

// 查询栏目信息详细
export function getInspChannel(data) {
    return request({
        url: '/biz/inspChannel/getInfo',
        method: 'post',
        data: data
    })
}

// 新增栏目信息
export function addInspChannel(data) {
    return request({
        url: '/biz/inspChannel/add',
        method: 'post',
        data: data
    })
}

// 修改栏目信息
export function updateInspChannel(data) {
    return request({
        url: '/biz/inspChannel/edit',
        method: 'post',
        data: data
    })
}

// 删除栏目信息
export function delInspChannel(data) {
    return request({
        url: '/biz/inspChannel/remove',
        method: 'post',
        data: data
    })
}

// 导出栏目信息
export function exportChannel(data) {
    return request({
        url: '/biz/inspChannel/export',
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
// 修改是否开启监测状态
export function editEnabled(data) {
    return request({
        url: '/biz/inspChannel/editEnabled',
        method: 'post',
        data: data
    })
}

// 获取请求链接返回码
export function getCode(data) {
    return request({
        url: '/biz/inspChannel/getCode',
        method: 'post',
        data: data
    })
}

