import request from '@/utils/request'

// 查询站点信息列表
export function listInspSiteInfo(data) {
    return request({
        url: '/biz/inspSiteInfo/list',
        method: 'post',
        data: data
    })
}

// 查询站点信息详细
export function getInspSiteInfo(data) {
    return request({
        url: '/biz/inspSiteInfo/getInfo',
        method: 'post',
        data: data
    })
}

// 新增站点信息
export function addInspSiteInfo(data) {
    return request({
        url: '/biz/inspSiteInfo/add',
        method: 'post',
        data: data
    })
}

// 修改站点信息
export function updateInspSiteInfo(data) {
    return request({
        url: '/biz/inspSiteInfo/edit',
        method: 'post',
        data: data
    })
}

// 删除站点信息
export function delInspSiteInfo(data) {
    return request({
        url: '/biz/inspSiteInfo/remove',
        method: 'post',
        data: data
    })
}

// 爬虫任务详情
export function columnListInfo(data) {
    return request({
        url: '/biz/column/getInfo',
        method: 'post',
        data: data
    })
}

// 新媒体主办账号生成sitteCode和最大值
export function selectMaxNum(data) {
    return request({
        url: '/biz/inspSiteInfo/selectMaxNum',
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


// 
// export const redirectInspectView = () => {
//     return request({
//       url: '/biz/inspSiteInfo/redirectInspectView',
//       method: 'get'
//     })
//   }

export function redirectInspectView(data) {
    return request({
        url: '/biz/inspSiteInfo/redirectInspectView',
        method: 'post',
        data: data
    })
}

// 网站标识码-刷新
export function getCustomSiteCode(data) {
    return request({
        url: '/biz/inspSiteInfo/getCustomSiteCode',
        method: 'post',
        data: data
    })
}

// 导入任务列表
export function getInspImportdataTaskList(data) {
    return request({
        url: '/biz/inspImportdataTask/list',
        method: 'post',
        data: data
    })
}
// 导入任务-记录列表
export function getImportRecordList(data) {
    return request({
        url: '/biz/inspImportdataTask/importRecord',
        method: 'post',
        data: data
    })
}