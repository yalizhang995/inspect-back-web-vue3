import request from '@/utils/request'

// 查询新媒体站点信息列表
export function listInspMediaInfo(data) {
    return request({
        url: '/biz/inspMediaInfo/list',
        method: 'post',
        data: data
    })
}

// 查询新媒体站点信息详细
export function getInspMediaInfo(data) {
    return request({
        url: '/biz/inspMediaInfo/getInfo',
        method: 'post',
        data: data
    })
}

// 新增新媒体站点信息
export function addInspMediaInfo(data) {
    return request({
        url: '/biz/inspMediaInfo/add',
        method: 'post',
        data: data
    })
}

// 修改新媒体站点信息
export function updateInspMediaInfo(data) {
    return request({
        url: '/biz/inspMediaInfo/edit',
        method: 'post',
        data: data
    })
}

// 删除新媒体站点信息
export function delInspMediaInfo(data) {
    return request({
        url: '/biz/inspMediaInfo/remove',
        method: 'post',
        data: data
    })
}

// 新媒体账号补充信息
export function queryMediaUserInfo(data) {
    return request({
        url: '/biz/inspMediaInfo/queryMediaUserInfo',
        method: 'post',
        data: data
    })
}
// 下发新媒体账号监测任务
export function addMediaTask(data) {
    return request({
        url: '/biz/inspMediaInfo/addMediaTask',
        method: 'post',
        data: data
    })
}

// 新媒体账号生成16位标识码和最大值
export function selectMaxNum(data) {
    return request({
        url: '/biz/inspMediaInfo/selectMaxNum',
        method: 'post',
        data: data
    })
}
// 模糊搜索标识码
export function queryList(data) {
    return request({
        url: '/biz/inspSiteInfo/queryList',
        method: 'post',
        data: data
    })
}
